// ===========================================================================
// Connected Roleplay
// https://connected-rp.com
// ===========================================================================
// FILE: client.js
// DESC: Locale for Connected Roleplay servers
// TYPE: Client (JavaScript)
// ===========================================================================

"use strict";

// ===========================================================================

let resourceStarted = false;
let resourceReady = false;
let resourceInit = false;

// ===========================================================================

exportFunction("getLocaleString", getLocaleString);
exportFunction("getGroupedLocaleString", getLocaleString);

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	resourceReady = true;
	if (resourceStarted && !resourceInit) {
		initResource();
	}
});

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	resourceStarted = true;
	if (resourceReady && !resourceInit) {
		initResource();
	}
});

// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
});

// ===========================================================================

function initResource() {
	resourceInit = true;
}

// ===========================================================================

function getLocaleString(localeId, stringName, ...args) {
	let tempString = getRawLocaleString(localeId, stringName);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		logToConsole(LOG_WARN, `[V.RP.Locale] Locale string missing for ${stringName} on language ${getLocaleData(localeId).englishName}`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getGroupedLocaleString(localeId, stringName, index, ...args) {
	let tempString = getRawGroupedLocaleString(localeId, stringName, index);

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getRawLocaleString(localeId, stringName) {
	if (typeof getLocaleStrings()[localeId][stringName] == "undefined") {
		logToConsole(LOG_WARN, `[V.RP.Locale] Locale string missing for ${getLocaleStrings()[localeId][stringName]} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	return getLocaleStrings()[localeId][stringName];
}

// ===========================================================================

function getRawGroupedLocaleString(localeId, stringName, index) {
	if (typeof getLocaleStrings()[localeId][stringName] == "undefined") {
		logToConsole(LOG_ERROR, `[V.RP.Locale] Grouped locale string missing for string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
	}

	if (typeof getLocaleStrings()[localeId][stringName][index] == "undefined") {
		logToConsole(LOG_ERROR, `[V.RP.Locale] Grouped locale string missing for index ${index} of string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	return getLocaleStrings()[localeId][stringName][index];
}

// ===========================================================================

function loadAllLocaleStrings() {
	let tempLocaleStrings = {};

	let locales = globalConfig.locale.locales;
	for (let i in locales) {
		let localeData = locales[i];
		let localeFile = JSON.parse(loadTextFile(`locale/${localeData.stringsFile}`));
		tempLocaleStrings[i] = localeFile;
	}

	return tempLocaleStrings;
}

// ===========================================================================

function getLocaleStrings() {
	return serverData.localeStrings;
}

// ===========================================================================

function getLocaleFromParams(params) {
	let locales = getLocales();
	if (isNaN(params)) {
		for (let i in locales) {
			if (toLowerCase(locales[i].isoCode).indexOf(toLowerCase(params)) != -1) {
				return i;
			}

			if (toLowerCase(locales[i].englishName).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function getLocales() {
	return localeData.locales;
}

// ===========================================================================

function getLocaleData(localeId) {
	if (typeof getLocales()[localeId] != "undefined") {
		return getLocales()[localeId];
	}

	return false;
}

// ===========================================================================

function getLocaleFromCountryISO(isoCode = "US") {
	for (let i in getLocales()) {
		for (let j in getLocales()[i].countries) {
			if (toLowerCase(getLocales()[i].countries[j]) == toLowerCase(isoCode)) {
				return getLocales()[i].id;
			}
		}
	}
}

// ===========================================================================