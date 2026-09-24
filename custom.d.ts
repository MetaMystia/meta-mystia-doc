declare var Fancybox:
	{ bind: (selector: string, options?: object) => void } | undefined;

interface Window {
	__domReadyScriptRan: boolean | undefined;
	_paq: unknown[] | undefined;
}
