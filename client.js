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
exportFunction("loadFlagImages", loadFlagImages);
exportFunction("getFlagImageFilePath", getFlagImageFilePath);

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
});

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	mainResource = findResourceByName("crp-gamemode") || findResourceByName("crp-gamemode-test");

	console.log(`[${thisResource.name}] Resource ready. Loading config/config.json ...`);
	let configFile = loadTextFile("config/config.json");
	scriptConfig = JSON.parse(configFile);
	if (scriptConfig == null) {
		console.log(`[${thisResource.name}] Could not load config/config.json. Resource stopping ...`);
		thisResource.stop();
		return false;
	}

	console.log(`[${thisResource.name}] Config loaded! Loading all text and command strings ...`);
	localeStrings = loadAllLocaleStrings();
	localeCommandStrings = loadAllLocaleCommandStrings();

	console.log(`[${thisResource.name}] All text and command strings loaded! Loading flag images ...`);
	loadFlagImages();
	console.log(`[${thisResource.name}] Flag images loaded! Locale script is fully loaded and ready!`);
});

// ===========================================================================

function getFlagImage(localeId) {
	return getLocaleData(localeId).flagImage;
}

// ===========================================================================

function loadFlagImages() {
	console.warn(`[${thisResource.name}] Loading flag images`);
	getLocales().forEach((locale) => {
		console.warn(`[${thisResource.name}] Loading flag image ${locale.flagImageFile} for ${locale.englishName}`);
		locale.flagImage = loadImageFile(`files/images/flags/${locale.flagImageFile}`);
	});
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

function getFlagImageFilePath(localeId) {
	return getLocaleData(localeId).flagImageFile;
}