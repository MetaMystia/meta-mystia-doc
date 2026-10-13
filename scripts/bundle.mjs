// @ts-check

/**
 * 用 esbuild 打包多语言构建工具为自包含单文件，供生产环境直接执行。
 *
 * cheerio 的 CJS 依赖使用动态 require，ESM 产物需要 createRequire 头承接。
 */

import { build } from 'esbuild';

await build({
	entryPoints: ['scripts/build.mjs'],
	bundle: true,
	platform: 'node',
	target: 'node24',
	format: 'esm',
	outfile: 'scripts/dist/build.mjs',
	logLevel: 'warning',
	banner: {
		js: "import { createRequire } from 'node:module';\nconst require = createRequire(import.meta.url);",
	},
});
