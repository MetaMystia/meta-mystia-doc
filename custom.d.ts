declare var Fancybox:
	{ bind: (selector: string, options?: object) => void } | undefined;

declare var FingerprintJS:
	| { load: () => Promise<{ get: () => Promise<{ visitorId: string }> }> }
	| undefined;

interface Window {
	__domReadyScriptRan: boolean | undefined;
	_paq: unknown[] | undefined;
}
