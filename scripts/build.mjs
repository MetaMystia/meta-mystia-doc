// @ts-check

/**
 * 文档站多语言构建。
 *
 * 流程：生成主题 → 逐语言调用 mdbook → 合并为唯一站点（无路由，页内切换）→ 生成搜索索引。
 * 开发机直接运行本文件；生产环境执行 esbuild 打包后的 scripts/dist/build.mjs。
 */

import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';

// 源码位于 scripts/，打包产物位于 scripts/dist/，以 book.toml 所在目录为仓库根
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = existsSync(path.join(SCRIPT_DIR, '..', 'book.toml'))
	? path.resolve(SCRIPT_DIR, '..')
	: path.resolve(SCRIPT_DIR, '..', '..');
const BUILD_DIR = path.join(ROOT, '.build');
const BOOK_DIR = path.join(ROOT, 'book');
const THEME_DIR = path.join(ROOT, 'theme');
const THEME_TEMPLATE_DIR = path.join(ROOT, 'theme.template');
const I18N_DIR = path.join(ROOT, 'i18n');

const DEFAULT_LOCALE = 'zh-CN';

/** @type {ReadonlyArray<{ code: string; label: string; glyph: string }>} */
const LOCALES = [
	{ code: 'zh-CN', label: '简体中文', glyph: '简' },
	{ code: 'zh-TW', label: '繁體中文', glyph: '繁' },
	{ code: 'en', label: 'English', glyph: 'A' },
	{ code: 'ja', label: '日本語', glyph: 'あ' },
	{ code: 'ko', label: '한국어', glyph: '한' },
];

const args = process.argv.slice(2);
const reuseBuilds = args.includes('--reuse');
const serveAfterBuild = args.includes('--serve');
const localesArg = args.find((arg) => arg.startsWith('--locales='));
const activeLocales = LOCALES.filter(
	(locale) =>
		localesArg === undefined ||
		localesArg.slice('--locales='.length).split(',').includes(locale.code)
);

if (!activeLocales.some((locale) => locale.code === DEFAULT_LOCALE)) {
	throw new Error(`构建必须包含默认语言 ${DEFAULT_LOCALE}`);
}

/**
 * @param {string} html
 */
function escapeHtml(html) {
	return html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * @param {string} command
 * @param {string[]} commandArgs
 * @param {NodeJS.ProcessEnv} [env]
 */
function run(command, commandArgs, env = {}) {
	const result = spawnSync(command, commandArgs, {
		cwd: ROOT,
		env: { ...process.env, ...env },
		stdio: 'inherit',
	});
	if (result.error) {
		throw result.error;
	}
	if (result.status !== 0) {
		throw new Error(
			`命令失败（退出码 ${result.status}）：${command} ${commandArgs.join(' ')}`
		);
	}
}

function assertMdbookAvailable() {
	const result = spawnSync('mdbook', ['--version'], { cwd: ROOT });
	if (result.error || result.status !== 0) {
		throw new Error('未找到 mdbook，请先安装 mdbook 并加入 PATH');
	}
}

async function loadLocaleData() {
	/** @type {Record<string, any>} */
	const data = {};
	for (const locale of activeLocales) {
		const file = path.join(I18N_DIR, `ui.${locale.code}.json`);
		data[locale.code] = JSON.parse(await readFile(file, 'utf8'));
	}
	return data;
}

async function generateTheme() {
	await rm(THEME_DIR, { recursive: true, force: true });
	await cp(THEME_TEMPLATE_DIR, THEME_DIR, { recursive: true });
}

/**
 * @param {Record<string, any>} localeData
 */
async function buildBooks(localeData) {
	for (const locale of activeLocales) {
		const dest = path.join(BUILD_DIR, locale.code);
		console.info(`[build] ${locale.code}`);
		run('mdbook', ['build', '-d', dest], {
			MDBOOK_BOOK__LANGUAGE: locale.code,
			MDBOOK_BOOK__SRC: path.posix.join('content', locale.code),
			MDBOOK_BOOK__TITLE: localeData[locale.code].book_title,
			MDBOOK_BOOK__DESCRIPTION: localeData[locale.code].book_description,
			MDBOOK_OUTPUT__HTML__THEME: 'theme',
		});
	}
}

/**
 * @param {string} summary
 */
function parsePages(summary) {
	const pages = new Set(['index.html', '404.html']);
	for (const match of summary.matchAll(/\]\(([^()]+?\.md)\)/gu)) {
		const target = match[1].replace(/^\.\//u, '');
		const page =
			target.toLowerCase() === 'readme.md'
				? 'index.html'
				: target.replace(/\.md$/u, '.html');
		pages.add(page);
	}
	return [...pages];
}

/**
 * 统一链接写法，便于比较当前页与侧栏链接。
 *
 * @param {string} link
 */
function normalizeLink(link) {
	return link.replace(/^\.\//u, '').replace(/\/{2,}/gu, '/');
}

/**
 * @param {string} url
 * @param {string} prefix
 */
function namespaceUrlFragment(url, prefix) {
	const hash = url.indexOf('#');
	if (hash < 0) {
		return url;
	}

	return `${url.slice(0, hash + 1)}${prefix}${url.slice(hash + 1)}`;
}

/**
 * 非默认语言的正文锚点统一加语言前缀，并同步改写页内、跨页 fragment 链接。
 *
 * @param {cheerio.CheerioAPI} $locale
 * @param {cheerio.Cheerio<any>} main
 * @param {string} prefix
 */
function namespaceContent($locale, main, prefix) {
	/** @type {Map<string, string>} */
	const idMap = new Map();

	main.find('[id]').each((_, element) => {
		const id = $locale(element).attr('id');
		if (!id) {
			return;
		}

		idMap.set(id, prefix + id);
		$locale(element).attr('id', prefix + id);
	});

	main.find('a[href]').each((_, element) => {
		const $link = $locale(element);
		const href = $link.attr('href');
		if (!href) {
			return;
		}

		if (href.startsWith('#')) {
			const fragment = href.slice(1);
			if (fragment.length > 0) {
				$link.attr(
					'href',
					`#${idMap.get(fragment) ?? prefix + fragment}`
				);
			}
			return;
		}

		// 只改写站内相对链接，外链原样保留
		if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu.test(href)) {
			return;
		}
		const hash = href.indexOf('#');
		if (hash < 0 || hash === href.length - 1) {
			return;
		}

		const pathPart = href.slice(0, hash);
		const fragment = href.slice(hash + 1);
		$link.attr('href', `${pathPart}#${prefix}${fragment}`);
	});

	for (const attribute of ['aria-labelledby', 'aria-describedby', 'for']) {
		main.find(`[${attribute}]`).each((_, element) => {
			const $element = $locale(element);
			const value = $element.attr(attribute);
			if (!value) {
				return;
			}

			const mapped = value
				.split(/\s+/u)
				.map((token) => idMap.get(token) ?? token)
				.join(' ');
			$element.attr(attribute, mapped);
		});
	}
}

/**
 * @param {string} locale
 * @param {string} page
 */
async function readPageHtml(locale, page) {
	return readFile(path.join(BUILD_DIR, locale, page), 'utf8');
}

/**
 * @param {string} page
 * @param {Record<string, any>} localeData
 */
async function mergePage(page, localeData) {
	const baseHtml = await readPageHtml(DEFAULT_LOCALE, page);
	const $ = cheerio.load(baseHtml);
	const pathToRoot =
		baseHtml.match(/const path_to_root = "([^"]*)";/u)?.[1] ?? '';

	/** @type {Record<string, string>} */
	const titles = {};
	/** @type {Record<string, string>} */
	const descriptions = {};
	/** @type {string[]} */
	const contentBlocks = [];

	for (const locale of activeLocales) {
		const html =
			locale.code === DEFAULT_LOCALE
				? baseHtml
				: await readPageHtml(locale.code, page);
		const $locale = locale.code === DEFAULT_LOCALE ? $ : cheerio.load(html);

		titles[locale.code] = $locale('title').first().text();
		descriptions[locale.code] =
			$locale('meta[name="description"]').attr('content') ?? '';

		const main = $locale('#mdbook-content main').first();
		if (locale.code !== DEFAULT_LOCALE) {
			namespaceContent($locale, main, `${locale.code}--`);
		}

		contentBlocks.push(
			`<div class="doc-lang-block" data-doc-lang="${locale.code}">${
				main.html() ?? ''
			}</div>`
		);
	}
	$('#mdbook-content main').html(contentBlocks.join('\n'));

	$('h1.menu-title').html(
		activeLocales
			.map(
				(locale) =>
					`<span class="doc-lang-inline" data-doc-lang="${locale.code}">${escapeHtml(
						localeData[locale.code].book_title
					)}</span>`
			)
			.join('')
	);

	/** @type {string[]} */
	const sidebarBlocks = [];
	const targetPage = normalizeLink(path.posix.join(pathToRoot, page));
	for (const locale of activeLocales) {
		const tocHtml = await readFile(
			path.join(BUILD_DIR, locale.code, 'toc.html'),
			'utf8'
		);
		const $toc = cheerio.load(tocHtml);
		const chapter = $toc('ol.chapter').first();
		chapter.find('a').removeAttr('target');
		chapter.find('a[href]').each((_, element) => {
			const $link = $toc(element);
			const href = $link.attr('href');
			if (
				!href ||
				href.startsWith('#') ||
				/^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu.test(href)
			) {
				return;
			}

			const absolute = normalizeLink(pathToRoot + href);
			$link.attr('href', absolute);
			if (absolute === targetPage) {
				$link.addClass('active');
				$link.parents('li.chapter-item').addClass('expanded');
			}
		});
		sidebarBlocks.push(
			`<div class="doc-lang-block" data-doc-lang="${locale.code}">${$toc.html(
				chapter
			)}</div>`
		);
	}
	$('#doc-sidebar').html(sidebarBlocks.join('\n'));

	/** @type {Record<string, any>} */
	const docData = {
		ui: {},
		titles,
		descriptions,
		locales: LOCALES,
		defaultLocale: DEFAULT_LOCALE,
	};
	for (const locale of activeLocales) {
		docData.ui[locale.code] = localeData[locale.code].ui;
	}
	$('#doc-data').text(JSON.stringify(docData).replace(/<\//gu, '<\\/'));

	await writeFile(path.join(BOOK_DIR, page), $.html());
}

/**
 * 合并各语言搜索索引；文档记录带 lang 字段，前端按当前语言过滤。
 */
async function buildSearchIndex() {
	/** @type {Record<string, any>} */
	const mergedDocs = {};
	/** @type {string[]} */
	const mergedUrls = [];
	/** @type {any} */
	let base = null;
	let counter = 0;

	for (const locale of activeLocales) {
		const files = await readdir(path.join(BUILD_DIR, locale.code));
		const file = files.find((name) => /^searchindex-.*\.js$/u.test(name));
		if (file === undefined) {
			continue;
		}

		const code = await readFile(
			path.join(BUILD_DIR, locale.code, file),
			'utf8'
		);
		/** @type {{ search: any }} */
		const sandbox = { search: {} };
		new Function('window', code)(sandbox);
		const data = sandbox.search;
		base ??= data;

		const docs = data.index.documentStore.docs;
		for (const key of Object.keys(docs)) {
			const id = String(counter);
			counter += 1;
			mergedDocs[id] = { ...docs[key], lang: locale.code };
			const url = data.doc_urls[Number(key)] ?? data.doc_urls[key];
			mergedUrls[Number(id)] =
				locale.code === DEFAULT_LOCALE
					? url
					: namespaceUrlFragment(url, `${locale.code}--`);
		}
	}

	const merged = {
		results_options: base.results_options,
		search_options: base.search_options,
		doc_urls: mergedUrls,
		index: {
			fields: base.index.fields,
			pipeline: base.index.pipeline,
			ref: base.index.ref,
			version: base.index.version,
			documentStore: { ...base.index.documentStore, docs: mergedDocs },
		},
	};
	return `window.search = Object.assign(window.search, ${JSON.stringify(
		merged
	)});\n`;
}

/**
 * @param {string[]} pages
 * @param {Record<string, any>} localeData
 */
async function assemble(pages, localeData) {
	await rm(BOOK_DIR, { recursive: true, force: true });
	await cp(path.join(BUILD_DIR, DEFAULT_LOCALE), BOOK_DIR, {
		recursive: true,
	});

	for (const page of pages) {
		await mergePage(page, localeData);
	}

	// 移除 mdBook 生成的单语言索引，改用合并索引
	for (const name of await readdir(BOOK_DIR)) {
		if (/^searchindex-.*\.js$/u.test(name)) {
			await rm(path.join(BOOK_DIR, name));
		}
	}
	await writeFile(
		path.join(BOOK_DIR, 'searchindex-all.js'),
		await buildSearchIndex()
	);
}

/**
 * @param {number} port
 */
function serve(port) {
	const types = new Map([
		['.css', 'text/css; charset=utf-8'],
		['.gif', 'image/gif'],
		['.html', 'text/html; charset=utf-8'],
		['.ico', 'image/x-icon'],
		['.jpeg', 'image/jpeg'],
		['.jpg', 'image/jpeg'],
		['.js', 'text/javascript; charset=utf-8'],
		['.json', 'application/json; charset=utf-8'],
		['.png', 'image/png'],
		['.svg', 'image/svg+xml; charset=utf-8'],
		['.txt', 'text/plain; charset=utf-8'],
		['.woff', 'font/woff'],
		['.woff2', 'font/woff2'],
	]);

	createServer(async (request, response) => {
		try {
			let pathname = decodeURIComponent(
				new URL(request.url ?? '/', 'http://localhost').pathname
			);
			if (pathname.endsWith('/')) {
				pathname += 'index.html';
			}
			let filePath = path.join(BOOK_DIR, pathname);
			if (!existsSync(filePath)) {
				filePath = path.join(BOOK_DIR, '404.html');
				response.statusCode = 404;
			}
			const body = await readFile(filePath);
			// 构建会重新生成哈希文件名，本地预览必须禁用缓存以免引用失效的旧资源
			response.setHeader('Cache-Control', 'no-store');
			response.setHeader(
				'Content-Type',
				types.get(path.extname(filePath)) ?? 'application/octet-stream'
			);
			response.end(body);
		} catch {
			response.statusCode = 500;
			response.end('Internal Server Error');
		}
	}).listen(port, () => {
		console.info(`[serve] http://localhost:${port}/`);
	});
}

async function main() {
	assertMdbookAvailable();
	const localeData = await loadLocaleData();

	if (reuseBuilds) {
		console.info('[build] 跳过 mdbook 构建（--reuse）');
	} else {
		await rm(BUILD_DIR, { recursive: true, force: true });
		await mkdir(BUILD_DIR, { recursive: true });
		await generateTheme();
		await buildBooks(localeData);
	}

	const summary = await readFile(
		path.join(ROOT, 'content', DEFAULT_LOCALE, 'SUMMARY.md'),
		'utf8'
	);
	const pages = parsePages(summary);
	console.info(
		`[merge] ${pages.length} 个页面 × ${activeLocales.length} 种语言`
	);
	await assemble(pages, localeData);
	console.info('[merge] 完成，输出目录 book/');

	if (serveAfterBuild) {
		serve(3000);
	}
}

await main();
