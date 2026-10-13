'use strict';

// @ts-check
/// <reference types="./custom.d.ts" />

(() => {
	/**
	 * @param {string} url
	 * @param {'async' | 'defer'} [method]
	 * @param {boolean} [crossOrigin]
	 */
	const setScriptUrlTag = (url, method, crossOrigin) => {
		/** @type {(element: HTMLElement) => void} */
		const cleanup = (element) => {
			if (document.head.contains(element)) {
				element.remove();
			}
		};

		return /** @type {Promise<void>} */ (
			new Promise((resolve, reject) => {
				const scriptElement = document.createElement('script');
				scriptElement.src = url;

				if (crossOrigin) {
					scriptElement.crossOrigin = 'anonymous';
				}
				if (method === 'async') {
					scriptElement.async = true;
				}
				if (method === 'defer') {
					scriptElement.defer = true;
				}

				scriptElement.addEventListener('load', () => {
					cleanup(scriptElement);
					resolve();
				});

				scriptElement.addEventListener('error', (error) => {
					cleanup(scriptElement);
					reject(error);
				});

				document.head.append(scriptElement);
			})
		);
	};

	const waitDomReady = () => {
		const checkReadyState = () => {
			/** @type {DocumentReadyState[]} */
			const READY_STATE = ['complete', 'interactive'];
			return READY_STATE.includes(document.readyState);
		};

		return /** @type {Promise<void>} */ (
			new Promise((resolve) => {
				if (checkReadyState()) {
					resolve();
				}

				const EVENT_TYPE = 'readystatechange';

				const handleReadystatechange = () => {
					if (checkReadyState()) {
						document.removeEventListener(
							EVENT_TYPE,
							handleReadystatechange
						);
						resolve();
					}
				};

				document.addEventListener(EVENT_TYPE, handleReadystatechange);
			})
		);
	};

	/**
	 * @type {{
	 * 	ui?: Record<string, Record<string, string>>;
	 * 	titles?: Record<string, string>;
	 * 	descriptions?: Record<string, string>;
	 * 	locales?: { code: string; label: string; glyph: string }[];
	 * 	defaultLocale?: string;
	 * }}
	 */
	const docData = (() => {
		try {
			const element = document.getElementById('doc-data');
			return element === null
				? {}
				: JSON.parse(element.textContent ?? '{}');
		} catch (error) {
			console.error('[custom] 解析语言数据失败', error);
			return {};
		}
	})();

	const locales = Array.isArray(docData.locales) ? docData.locales : [];
	const defaultLocale =
		typeof docData.defaultLocale === 'string'
			? docData.defaultLocale
			: 'zh-CN';

	const currentLocale = () => {
		const value = document.documentElement.dataset.docLocale;
		return typeof value === 'string' && value.length > 0
			? value
			: defaultLocale;
	};

	/**
	 * @param {string} [locale]
	 */
	const uiStrings = (locale = currentLocale()) => docData.ui?.[locale] ?? {};

	/** @type {() => void} */
	let refreshSearchHeader = () => {};

	(() => {
		const BASE_URL = 'izakaya.cc';
		if (location.hostname.endsWith(`.${BASE_URL}`)) {
			const ANALYTICS_BASE_URL = `https://track.${BASE_URL}`;
			const ANALYTICS_API_URL = `${ANALYTICS_BASE_URL}/api.php`;
			const ANALYTICS_SCRIPT_URL = `${ANALYTICS_BASE_URL}/api.js`;
			const ANALYTICS_SITE_ID = '12';

			if (window._paq !== undefined) {
				return;
			}

			/** @type {(...args: unknown[]) => void} */
			const push = (...args) => {
				window._paq ??= [];
				window._paq.push(...args);
			};

			push(
				['enableHeartBeatTimer'],
				['enableLinkTracking'],
				['setCookieDomain', `*.${BASE_URL}`],
				['setRequestMethod', 'GET'],
				['setTrackerUrl', ANALYTICS_API_URL],
				['setSecureCookie', true],
				['setSiteId', ANALYTICS_SITE_ID]
			);

			setScriptUrlTag(ANALYTICS_SCRIPT_URL, 'async', true)
				.then(() => {
					FingerprintJS?.load()
						.then((fp) => fp.get())
						.then(({ visitorId }) => {
							push(['setUserId', visitorId], ['trackPageView']);
						});
					setTimeout(() => {
						push(['ping']);
					}, 30 * 1000);
					console.info('Analytics load succeeded.');
				})
				.catch((error) => {
					console.error('Analytics load failed.', error);
				});
		}
	})();

	waitDomReady().then(() => {
		if (window.__domReadyScriptRan) {
			return;
		}
		window.__domReadyScriptRan = true;

		/**
		 * @description Open external links in a new tab
		 */
		document.querySelectorAll('#mdbook-content a')?.forEach((a) => {
			const href = a.getAttribute('href');
			if (!href) {
				return;
			}

			if (href.startsWith('http://') || href.startsWith('https://')) {
				try {
					if (
						new URL(href, location.href).hostname !==
						location.hostname
					) {
						a.setAttribute('target', '_blank');
						a.setAttribute('rel', 'noopener noreferrer');
					}
				} catch {}
			}
		});

		/**
		 * @description Enable Fancybox for images that are the only child of a paragraph
		 */
		document.querySelectorAll('p > img:only-child')?.forEach((img) => {
			if (
				!(img instanceof HTMLImageElement) ||
				img.parentNode === null ||
				img.closest('a')
			) {
				return;
			}

			const link = document.createElement('a');
			link.dataset.fancybox = 'images';
			link.href = img.src;

			img.parentNode.replaceChild(link, img);
			link.appendChild(img);
		});

		const bindFancybox = () => {
			if (Fancybox !== undefined) {
				Fancybox.bind('[data-fancybox="images"]', { theme: 'auto' });
				return true;
			}
		};
		(() => {
			if (bindFancybox()) {
				return;
			}
			let fancyboxInitCount = 0;
			const fancyboxInterval = setInterval(() => {
				if (Fancybox === undefined) {
					fancyboxInitCount += 1;
					if (fancyboxInitCount >= 50) {
						clearInterval(fancyboxInterval);
					}
				} else {
					Fancybox.bind('[data-fancybox="images"]', {
						theme: 'auto',
					});
					clearInterval(fancyboxInterval);
				}
			}, 50);
		})();

		/**
		 * @description Fill in the latest version fetched from the version API
		 */
		(async () => {
			const managerElements = document.querySelectorAll(
				'span.version-manager'
			);
			const dllElements = document.querySelectorAll('span.version-dll');
			const zipElements = document.querySelectorAll('span.version-zip');

			if (
				managerElements.length === 0 &&
				dllElements.length === 0 &&
				zipElements.length === 0
			) {
				return;
			}

			const response = await fetch(
				'https://api.izakaya.cc/version/meta-mystia'
			).catch(() => null);
			if (!response?.ok) {
				return;
			}

			/** @type {{manager: string | null; dll: string | null; zip: string | null}} */
			const data = await response.json().catch(() => null);
			if (data === null) {
				return;
			}

			/**
			 * @param {NodeListOf<Element>} elements
			 * @param {string | null} value
			 */
			const fill = (elements, value) => {
				if (value === null) {
					return;
				}

				elements.forEach((el) => {
					el.innerHTML = el.innerHTML.replace('*', () => value);
				});
			};

			fill(managerElements, data.manager);
			fill(dllElements, data.dll);
			fill(zipElements, data.zip);
		})();

		/**
		 * @description Translate the search results header into the active language
		 */
		(() => {
			const el = document.getElementById('mdbook-searchresults-header');
			if (el === null) {
				return;
			}

			/** @type {{ kind: 'results' | 'none'; count?: string; keyword: string } | null} */
			let state = null;

			/**
			 * @param {string} text
			 */
			const parse = (text) => {
				let match = text.match(/^(\d+) search results for\s+'(.+)':$/i);
				if (match !== null) {
					return /** @type {const} */ ({
						kind: 'results',
						count: match[1],
						keyword: match[2],
					});
				}

				match = text.match(/^No search results for\s+'(.+)'\.$/i);
				if (match !== null) {
					return /** @type {const} */ ({
						kind: 'none',
						keyword: match[1],
					});
				}

				return null;
			};

			const render = () => {
				if (state === null) {
					return;
				}

				const strings = uiStrings();
				const template =
					state.kind === 'results'
						? strings.search_results
						: strings.search_no_results;
				if (typeof template !== 'string') {
					return;
				}

				el.textContent = template
					.replace('{count}', () => state?.count ?? '')
					.replace('{keyword}', () => state?.keyword ?? '');
			};
			refreshSearchHeader = render;

			const handle = () => {
				const parsed = parse(el.textContent?.trim() ?? '');
				if (parsed !== null) {
					state = parsed;
					render();
				}
			};

			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (
						mutation.type === 'characterData' ||
						mutation.type === 'childList'
					) {
						handle();
						break;
					}
				}
			});

			handle();
			observer.observe(el, {
				characterData: true,
				childList: true,
				subtree: true,
			});
		})();

		/**
		 * @description Language switching: update attributes, title, search state
		 */
		const sidebar = document.getElementById('doc-sidebar');

		/**
		 * @param {string} locale
		 */
		const scrollSidebarToActive = (locale) => {
			const active = sidebar?.querySelector(
				`[data-doc-lang="${locale}"] a.active`
			);
			if (sidebar && active instanceof HTMLElement) {
				sidebar.scrollTop = active.offsetTop - sidebar.clientHeight / 2;
			}
		};

		/**
		 * mdBook 5 会在 DOMContentLoaded 时扫描 <main> 并把本页标题树注入侧栏，
		 * 多语言合并后会把五种语言的标题全部收进来，这里改为按当前语言重建。
		 *
		 * @param {string} locale
		 */
		const rebuildOnThisPage = (locale) => {
			if (sidebar === null) {
				return;
			}

			for (const node of sidebar.querySelectorAll('.on-this-page')) {
				node.remove();
			}

			const active = sidebar.querySelector(
				`[data-doc-lang="${locale}"] a.active`
			);
			const block = document.querySelector(
				`#mdbook-content [data-doc-lang="${locale}"]`
			);
			if (!(active instanceof Element) || !(block instanceof Element)) {
				return;
			}

			const headers = [
				...block.querySelectorAll('h2, h3, h4, h5, h6'),
			].filter(
				(header) =>
					header.id.length > 0 &&
					header.firstElementChild?.tagName === 'A'
			);
			if (headers.length === 0) {
				return;
			}

			const root = document.createElement('ol');
			root.className = 'section';
			/** @type {{ level: number; list: Element }[]} */
			const stack = [
				{ level: Number(headers[0].tagName.charAt(1)), list: root },
			];

			for (const header of headers) {
				const anchor = header.firstElementChild;
				if (anchor === null) {
					continue;
				}
				const level = Number(header.tagName.charAt(1));
				while (
					stack.length > 1 &&
					stack[stack.length - 1].level > level
				) {
					stack.pop();
				}
				const top = stack[stack.length - 1];
				if (level > top.level) {
					const nested = document.createElement('ol');
					nested.className = 'section';
					(top.list.lastElementChild ?? top.list).append(nested);
					stack.push({ level, list: nested });
				}

				const item = document.createElement('li');
				item.className = 'header-item expanded';
				const wrapper = document.createElement('span');
				wrapper.className = 'chapter-link-wrapper';
				const link = document.createElement('a');
				link.className = 'header-in-summary';
				link.href = `#${header.id}`;
				for (const child of anchor.childNodes) {
					link.append(child.cloneNode(true));
				}
				wrapper.append(link);
				item.append(wrapper);
				top.list.append(item);
			}

			const container = document.createElement('div');
			container.className = 'on-this-page';
			container.append(root);
			active.parentElement?.after(container);
		};

		/**
		 * @param {string} locale
		 */
		const applyAttributes = (locale) => {
			const strings = uiStrings(locale);

			/**
			 * @param {string} id
			 * @param {string | undefined} value
			 * @param {'text' | 'html'} [mode]
			 */
			const setText = (id, value, mode = 'html') => {
				const element = document.getElementById(id);
				if (element && typeof value === 'string') {
					if (mode === 'text') {
						element.textContent = value;
					} else {
						element.innerHTML = value;
					}
				}
			};

			/**
			 * @param {Element | null | undefined} element
			 * @param {string} attribute
			 * @param {string | undefined} value
			 */
			const setAttribute = (element, attribute, value) => {
				if (element && typeof value === 'string') {
					element.setAttribute(attribute, value);
				}
			};

			const searchbar = document.getElementById('mdbook-searchbar');
			setAttribute(searchbar, 'placeholder', strings.search_placeholder);

			const searchToggle = document.getElementById(
				'mdbook-search-toggle'
			);
			setAttribute(searchToggle, 'title', strings.search_toggle_title);
			setAttribute(
				searchToggle,
				'aria-label',
				strings.search_toggle_aria ?? strings.search_toggle_title
			);

			const sidebarToggle = document.getElementById(
				'mdbook-sidebar-toggle'
			);
			setAttribute(sidebarToggle, 'title', strings.sidebar_toggle_title);
			setAttribute(
				sidebarToggle,
				'aria-label',
				strings.sidebar_toggle_title
			);

			const themeToggle = document.getElementById('mdbook-theme-toggle');
			setAttribute(themeToggle, 'title', strings.theme_toggle_title);
			setAttribute(themeToggle, 'aria-label', strings.theme_toggle_title);

			const themeList = document.getElementById('mdbook-theme-list');
			setAttribute(themeList, 'aria-label', strings.theme_popup_aria);
			setText(
				'mdbook-theme-default_theme',
				strings.theme_default,
				'text'
			);

			const github = document.getElementById('doc-github');
			setAttribute(github, 'title', strings.github_title);
			setAttribute(github, 'aria-label', strings.github_title);

			const edit = document.getElementById('doc-edit');
			setAttribute(edit, 'title', strings.edit_title);
			setAttribute(edit, 'aria-label', strings.edit_title);

			const langToggle = document.getElementById('doc-lang-toggle');
			setAttribute(langToggle, 'title', strings.language_title);
			setAttribute(langToggle, 'aria-label', strings.language_title);

			const langList = document.getElementById('doc-lang-list');
			setAttribute(
				langList,
				'aria-label',
				strings.language_aria ?? strings.language_title
			);

			for (const link of document.querySelectorAll(
				'a.nav-chapters.previous'
			)) {
				setAttribute(link, 'title', strings.prev_title);
				setAttribute(link, 'aria-label', strings.prev_title);
			}
			for (const link of document.querySelectorAll(
				'a.nav-chapters.next'
			)) {
				setAttribute(link, 'title', strings.next_title);
				setAttribute(link, 'aria-label', strings.next_title);
			}

			setText('doc-help-title', strings.help_title);
			setText('doc-help-nav', strings.help_nav);
			setText('doc-help-search', strings.help_search);
			setText('doc-help-show', strings.help_show);
			setText('doc-help-hide', strings.help_hide);

			const titles = docData.titles ?? {};
			if (typeof titles[locale] === 'string') {
				document.title = titles[locale];
			}
			const descriptions = docData.descriptions ?? {};
			if (typeof descriptions[locale] === 'string') {
				document
					.querySelector('meta[name="description"]')
					?.setAttribute('content', descriptions[locale]);
			}

			for (const item of document.querySelectorAll(
				'#doc-lang-list .doc-lang-item'
			)) {
				item.setAttribute(
					'aria-checked',
					String(item.getAttribute('data-doc-locale') === locale)
				);
			}
		};

		/**
		 * @param {string} locale
		 * @param {{ persist?: boolean }} [options]
		 */
		const applyLocale = (locale, options = {}) => {
			if (!locales.some((item) => item.code === locale)) {
				return;
			}

			document.documentElement.lang = locale;
			document.documentElement.dataset.docLocale = locale;
			applyAttributes(locale);
			refreshSearchHeader();
			scrollSidebarToActive(locale);
			rebuildOnThisPage(locale);

			if (options.persist) {
				try {
					localStorage.setItem('doc-locale', locale);
				} catch {}
			}

			const wrapper = document.getElementById('mdbook-search-wrapper');
			const searchbar = document.getElementById('mdbook-searchbar');
			if (
				wrapper &&
				!wrapper.classList.contains('hidden') &&
				searchbar instanceof HTMLInputElement &&
				searchbar.value.length > 0
			) {
				searchbar.dispatchEvent(new Event('input', { bubbles: true }));
			}
		};

		const langToggle = document.getElementById('doc-lang-toggle');
		const langList = document.getElementById('doc-lang-list');
		const closeLangList = () => {
			langList?.classList.remove('open');
			langToggle?.setAttribute('aria-expanded', 'false');
		};

		langToggle?.addEventListener('click', (event) => {
			event.stopPropagation();
			const open = langList?.classList.toggle('open') ?? false;
			langToggle.setAttribute('aria-expanded', String(open));
		});
		langList?.addEventListener('click', (event) => {
			const item =
				event.target instanceof Element
					? event.target.closest('.doc-lang-item')
					: null;
			if (!(item instanceof HTMLElement)) {
				return;
			}

			const locale = item.getAttribute('data-doc-locale');
			if (locale !== null) {
				applyLocale(locale, { persist: true });
			}
			closeLangList();
		});
		document.addEventListener('click', (event) => {
			if (!(event.target instanceof Node)) {
				return;
			}
			if (!langList?.contains(event.target)) {
				closeLangList();
			}
		});
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeLangList();
			}
		});

		applyLocale(currentLocale());

		// 本脚本注册晚于 toc.js，DOMContentLoaded 处理顺序在其后，
		// 可以清掉 mdBook 按整页注入的多语言标题树
		document.addEventListener('DOMContentLoaded', () => {
			rebuildOnThisPage(currentLocale());
		});
	});
})();
