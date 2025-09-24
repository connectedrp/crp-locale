// ===========================================================================
// Connected Roleplay
// https://connected-rp.com
// ===========================================================================
// FILE: client.js
// DESC: Locale for Connected Roleplay servers
// TYPE: Client (JavaScript)
// ===========================================================================

"use strict";

exportFunction("getFlagImage", getFlagImage);

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	mainResource = findResourceByName("crp-gamemode") || findResourceByName("crp-gamemode-test");
	/*
	if (thisResource.isReady && localeStrings.length != 0) {
		let configFile = loadTextFile("config/config.json");
		scriptConfig = JSON.parse(configFile);
		if (scriptConfig == null) {
			console.log(`[${thisResource.name}] Could not load config/config.json. Resource stopping ...`);
			thisResource.stop();
			return false;
		}

		localeStrings = loadAllLocaleStrings();
		localeCommandStrings = loadAllLocaleCommandStrings();
		loadFlagImages();
	}
	*/
});

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	mainResource = findResourceByName("crp-gamemode") || findResourceByName("crp-gamemode-test");

	if (thisResource.isStarted && localeStrings.length != 0) {
		let configFile = loadTextFile("config/config.json");
		scriptConfig = JSON.parse(configFile);
		console.log(scriptConfig);
		if (scriptConfig == null) {
			console.log(`[${thisResource.name}] Could not load config/config.json. Resource stopping ...`);
			thisResource.stop();
			return false;
		}

		localeStrings = loadAllLocaleStrings();
		localeCommandStrings = loadAllLocaleCommandStrings();
		loadFlagImages();
	}

});

// ===========================================================================

function initResource() {
	resourceInit = true;
}

// ===========================================================================

function getFlagImage(localeId) {
	return getLocales()[localeId].flagImage;
}

// ===========================================================================

function loadFlagImages() {
	let locales = getLocales();
	for (let i in locales) {
		locales[i].flagImage = loadImageFile(locales[i].flagImageFile);
	}
}

// ===========================================================================

function loadImageFile(filePath) {
	let imageFile = openFile(filePath);
	let imageObject = null;
	if (imageFile != null) {
		imageObject = graphics.loadPNG(imageFile);
		imageFile.close();
	}

	return imageObject;
}

// ===========================================================================