// @ts-check

/**
 * 多语言文档结构校验。
 *
 * 校验内容：各语言文件集合一致、代码块与占位符数量一致、站内链接可达、
 * 界面词条键一致；book/ 存在时同时检查合并产物的分块与索引。
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const I18N_DIR = path.join(ROOT, 'i18n');
const BOOK_DIR = path.join(ROOT, 'book');

const DEFAULT_LOCALE = 'zh-CN';
const LOCALES = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'];

/** @type {string[]} */
const problems = [];

/**
 * @param {string} message
 */
function report(message) {
	problems.push(message);
}

/**
 * @param {string} dir
 * @param {string} [prefix]
 * @returns {Promise<string[]>}
 */
async function listFiles(dir, prefix = '') {
	/** @type {string[]} */
	const files = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const name = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
		if (entry.isDirectory()) {
			files.push(...(await listFiles(path.join(dir, entry.name), name)));
		} else if (entry.isFile() && name.endsWith('.md')) {
			files.push(name);
		}
	}
	return files.sort();
}

/**
 * @param {string} text
 * @param {RegExp} pattern
 */
function countMatches(text, pattern) {
	return [...text.matchAll(pattern)].length;
}

/**
 * @param {string} text
 */
function collectAnchors(text) {
	/** @type {Set<string>} */
	const anchors = new Set();
	for (const match of text.matchAll(/\{#([^}]+)\}/gu)) {
		anchors.add(match[1]);
	}
	for (const match of text.matchAll(/ id="([^"]+)"/gu)) {
		anchors.add(match[1]);
	}

	/** @type {Map<string, number>} */
	const used = new Map();
	for (const match of text.matchAll(/^#{1,6}\s+(.+)$/gmu)) {
		// mdBook 的标题锚点：保留字母数字（小写），空格转连字符，其余字符丢弃
		const base = [
			...match[1]
				.replace(/\s*\{#[^}]+\}\s*$/u, '')
				.trim()
				.toLowerCase(),
		]
			.map((char) => {
				if (char === ' ' || char === '\t') {
					return '-';
				}
				return /[\p{L}\p{N}]/u.test(char) ? char : '';
			})
			.join('');
		const count = used.get(base) ?? 0;
		used.set(base, count + 1);
		anchors.add(count === 0 ? base : `${base}-${count}`);
	}
	return anchors;
}

/**
 * @param {string} locale
 * @param {string[]} referenceFiles
 */
async function checkContent(locale, referenceFiles) {
	const localeDir = path.join(CONTENT_DIR, locale);
	const files = await listFiles(localeDir);

	const missing = referenceFiles.filter((file) => !files.includes(file));
	const extra = files.filter((file) => !referenceFiles.includes(file));
	for (const file of missing) {
		report(`[${locale}] 缺少文件：${file}`);
	}
	for (const file of extra) {
		report(`[${locale}] 多出文件：${file}`);
	}

	for (const file of files) {
		if (!referenceFiles.includes(file)) {
			continue;
		}
		const text = await readFile(path.join(localeDir, file), 'utf8');
		const source = await readFile(
			path.join(CONTENT_DIR, DEFAULT_LOCALE, file),
			'utf8'
		);

		const fences = countMatches(text, /^```/gmu);
		const sourceFences = countMatches(source, /^```/gmu);
		if (fences !== sourceFences) {
			report(
				`[${locale}] ${file} 代码块数量不一致：${fences} != ${sourceFences}`
			);
		}

		for (const kind of ['version-manager', 'version-dll', 'version-zip']) {
			const spans = countMatches(
				text,
				new RegExp(`class="${kind}"`, 'gu')
			);
			const sourceSpans = countMatches(
				source,
				new RegExp(`class="${kind}"`, 'gu')
			);
			if (spans !== sourceSpans) {
				report(
					`[${locale}] ${file} ${kind} 占位符数量不一致：${spans} != ${sourceSpans}`
				);
			}
		}

		const anchors = collectAnchors(text);
		for (const match of text.matchAll(/\]\(([^)\s]+)\)/gu)) {
			const target = match[1];
			if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/iu.test(target)) {
				continue;
			}

			const [targetPath, fragment] = target.split('#');
			const resolved =
				targetPath === undefined || targetPath === ''
					? file
					: path
							.join(path.dirname(file), decodeURI(targetPath))
							.replace(/\\/gu, '/');
			const localPath = path.join(localeDir, resolved);
			// 图片等素材各语言共用，来源为默认语言目录
			const sharedPath = path.join(CONTENT_DIR, DEFAULT_LOCALE, resolved);
			if (!existsSync(localPath) && !existsSync(sharedPath)) {
				report(`[${locale}] ${file} 链接目标不存在：${target}`);
				continue;
			}
			if (fragment === undefined || fragment === '') {
				continue;
			}
			if (resolved !== file && !resolved.endsWith('.md')) {
				continue;
			}
			if (resolved !== file && !existsSync(localPath)) {
				continue;
			}

			const anchorFile = resolved;
			const anchorText =
				anchorFile === file
					? text
					: await readFile(path.join(localeDir, anchorFile), 'utf8');
			if (!collectAnchors(anchorText).has(fragment)) {
				report(
					`[${locale}] ${file} 锚点不存在：${target}（${anchorFile}）`
				);
			}
		}
	}
}

async function checkUiStrings() {
	/** @type {string[]} */
	let referenceKeys = [];
	for (const locale of LOCALES) {
		const file = path.join(I18N_DIR, `ui.${locale}.json`);
		if (!existsSync(file)) {
			report(`缺少界面词条文件：i18n/ui.${locale}.json`);
			continue;
		}

		const data = JSON.parse(await readFile(file, 'utf8'));
		const keys = Object.keys(data.ui ?? {}).sort();
		if (referenceKeys.length === 0) {
			referenceKeys = keys;
		} else if (keys.join() !== referenceKeys.join()) {
			report(`[${locale}] 界面词条键与 ${DEFAULT_LOCALE} 不一致`);
		}
		for (const key of ['book_title', 'book_description']) {
			if (typeof data[key] !== 'string' || data[key].length === 0) {
				report(`[${locale}] 缺少 ${key}`);
			}
		}
	}
}

async function checkBook() {
	if (!existsSync(BOOK_DIR)) {
		console.info('[check] 未找到 book/，跳过合并产物校验');
		return;
	}

	const summary = await readFile(
		path.join(CONTENT_DIR, DEFAULT_LOCALE, 'SUMMARY.md'),
		'utf8'
	);
	/** @type {string[]} */
	const pages = ['index.html', '404.html'];
	for (const match of summary.matchAll(/\]\(([^()]+?\.md)\)/gu)) {
		const target = match[1].replace(/^\.\//u, '');
		pages.push(
			target.toLowerCase() === 'readme.md'
				? 'index.html'
				: target.replace(/\.md$/u, '.html')
		);
	}

	for (const page of pages) {
		const file = path.join(BOOK_DIR, page);
		if (!existsSync(file)) {
			report(`book/ 缺少页面：${page}`);
			continue;
		}

		const html = await readFile(file, 'utf8');
		const blocks = countMatches(html, /class="doc-lang-block"/gu);
		if (blocks !== LOCALES.length * 2) {
			report(
				`book/${page} 语言分块数量异常：${blocks}，预期 ${LOCALES.length * 2}`
			);
		}
		if (!html.includes('id="doc-data"')) {
			report(`book/${page} 缺少语言数据脚本`);
		}
		for (const locale of LOCALES) {
			if (!html.includes(`data-doc-lang="${locale}"`)) {
				report(`book/${page} 缺少 ${locale} 分块`);
			}
		}
	}

	if (!existsSync(path.join(BOOK_DIR, 'searchindex-all.js'))) {
		report('book/ 缺少合并搜索索引 searchindex-all.js');
	}
}

async function main() {
	const referenceFiles = await listFiles(
		path.join(CONTENT_DIR, DEFAULT_LOCALE)
	);
	for (const locale of LOCALES) {
		if (locale === DEFAULT_LOCALE) {
			continue;
		}
		await checkContent(locale, referenceFiles);
	}
	await checkUiStrings();
	await checkBook();

	if (problems.length > 0) {
		for (const problem of problems) {
			console.error(`[check] ${problem}`);
		}
		process.exitCode = 1;
		return;
	}
	console.info('[check] 校验通过');
}

await main();
