export function isElectron() {
	// **PS** not really needed if you setup __ELECTRON__ : vite-env.d.ts, package.json scripts, vite.config.ts;; PS also use cross-env: "yarn add -D cross-env"
	const windowIsElectron = !!(window as any).electron; // **PS**
	const navigatorUserAgentIsElectron = navigator.userAgent.toLowerCase().includes("electron"); // **PS**
	console.info("isElectron", {windowIsElectron, navigatorUserAgentIsElectron, __ELECTRON__});
	return windowIsElectron || navigatorUserAgentIsElectron || __ELECTRON__;
}