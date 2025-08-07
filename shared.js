// ===========================================================================
// (c) 2025 Connected Roleplay (connected-rp.com)
// https://connected-rp.com
// ===========================================================================
// FILE: shared.js
// DESC: Locale for Connected Roleplay servers
// TYPE: Server/Client (JavaScript)
// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	if (thisResource.isReady) {
		localeStrings = loadAllLocaleStrings();
		localeCommandStrings = loadAllLocaleCommandStrings();
	}
});

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	if (thisResource.isStarted) {
		localeStrings = loadAllLocaleStrings();
		localeCommandStrings = loadAllLocaleCommandStrings();
	}
});
