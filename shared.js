// ===========================================================================
// (c) 2025 Connected Roleplay (connected-rp.com)
// https://connected-rp.com
// ===========================================================================
// FILE: shared.js
// DESC: Locale for Connected Roleplay servers
// TYPE: Server/Client (JavaScript)
// ===========================================================================

class LocaleData {
	constructor() {
		this.id = 0;
		this.name = "";
		this.englishName = "";
		this.stringsFile = "";
		this.flagImagePath = "";
		this.contributors = "";
		this.countries = [];
		this.requiresUnicode = false;
	}
}

// ===========================================================================

let englishLocale = 0;
let cachedTranslations = [];
let mainResource = null;

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	mainResource = findResourceByName("crp-gamemode") || findResourceByName("crp-gamemode-test");
	if (thisResource.isReady) {
		localeStrings = loadAllLocaleStrings();
		localeCommandStrings = loadAllLocaleCommandStrings();
	}

	exportFunction("getLocaleString", getLocaleString);
	exportFunction("getRawLocaleString", getRawLocaleString);
	exportFunction("getRawGroupedLocaleString", getRawGroupedLocaleString);
	exportFunction("getLocaleData", getLocaleData);
	exportFunction("getLocaleStrings", getLocaleStrings);
	exportFunction("getLocaleCommandStrings", getLocaleCommandStrings);
	exportFunction("getLocaleName", getLocaleName);
	exportFunction("getLocaleISO", getLocaleISO);
	exportFunction("loadAllLocaleStrings", loadAllLocaleStrings);
	exportFunction("loadAllLocaleCommandStrings", loadAllLocaleCommandStrings);
	exportFunction("getLocaleFromParams", getLocaleFromParams);
	exportFunction("getLocaleList", getLocaleList);
	exportFunction("getLocaleFromCountryISO", getLocaleFromCountryISO);
	exportFunction("isTranslationCached", isTranslationCached);
	exportFunction("getAmountOfLocaleStringsInGroup", getAmountOfLocaleStringsInGroup);
	exportFunction("getLocaleStringsInGroup", getLocaleStringsInGroup);
	exportFunction("getLocaleCommandName", getLocaleCommandName);
});

// ===========================================================================

bindEventHandler("OnResourceReady", thisResource, function (event, resource) {
	mainResource = findResourceByName("crp-gamemode") || findResourceByName("crp-gamemode-test");
	if (thisResource.isStarted) {
		localeStrings = loadAllLocaleStrings();
		localeCommandStrings = loadAllLocaleCommandStrings();
	}
});

// ===========================================================================

function getLocaleString(localeId, stringName, ...args) {
	let tempString = getRawLocaleString(localeId, stringName);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		mainResource.exports.logToConsole(LOG_WARN, `[V.RP.Locale] Locale string missing for ${stringName} on language ${getLocaleData(localeId).englishName}`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Locale string "${stringName}" is missing for "${getLocaleData(localeId).englishName}"`);
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
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		mainResource.exports.logToConsole(LOG_WARN, `[V.RP.Locale] Locale string missing for index ${index} of "${stringName}" on language ${getLocaleData(localeId).englishName}`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Locale string index ${index} of "${stringName}" is missing for "${getLocaleData(localeId).englishName}"`);
		return `${getLocaleData(localeId).englishName} locale message missing for index "${index}" of "${stringName}" (reported to developer)`;
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getRawLocaleString(localeId, stringName) {
	if (typeof getLocaleStrings()[localeId][stringName] == "undefined") {
		logToConsole(LOG_WARN, `[V.RP.Locale] Locale string missing for ${getLocaleStrings()[localeId][stringName]} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		submitBugReport(null, `(AUTOMATED REPORT) Locale string is missing for "${getLocaleStrings()[localeId][stringName]}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	return getLocaleStrings()[localeId][stringName];
}

// ===========================================================================

function getRawGroupedLocaleString(localeId, stringName, index) {
	if (typeof getLocaleStrings()[localeId][stringName] == "undefined") {
		logToConsole(LOG_ERROR, `[V.RP.Locale] Grouped locale string missing for string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		submitBugReport(null, `(AUTOMATED REPORT) Grouped locale string is missing for string "${stringName}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
	}

	if (typeof getLocaleStrings()[localeId][stringName][index] == "undefined") {
		logToConsole(LOG_ERROR, `[V.RP.Locale] Grouped locale string missing for index ${index} of string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		submitBugReport(null, `(AUTOMATED REPORT) Grouped locale string is missing for index ${index} of string "${stringName}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	return getLocaleStrings()[localeId][stringName][index];
}

// ===========================================================================

function getLocaleName(localeId) {
	return getLocales()[localeId].englishName;
}

// ===========================================================================

function getLocaleISO(localeId) {
	if (typeof getLocales()[localeId] == "undefined") {
		logToConsole(LOG_ERROR, `[V.RP.Locale] Locale ID ${localeId} does not exist!`);
		return getLocales()[globalConfig.locale.defaultLanguageId].isoCode;
	}

	return getLocales()[localeId].isoCode;
}

// ===========================================================================

function loadAllLocaleStrings() {
	let tempLocaleStrings = {};

	let locales = globalConfig.locale.locales;
	for (let i in locales) {
		let localeData = locales[i];
		let localeFile = JSON.parse(loadTextFile(`locale/text/${localeData.stringsFile}`));
		tempLocaleStrings[i] = localeFile;
	}

	return tempLocaleStrings;
}

// ===========================================================================

function loadAllLocaleCommandStrings() {
	let tempLocaleStrings = {};

	let locales = globalConfig.locale.locales;
	for (let i in locales) {
		let localeData = locales[i];
		let localeFile = JSON.parse(loadTextFile(`locale/commands/${localeData.stringsFile}`));
		tempLocaleStrings[i] = localeFile;
	}

	return tempLocaleStrings;
}

// ===========================================================================

function getLocaleStrings(localeId = -1) {
	if (localeId != -1) {
		return serverData.localeStrings[localeId];
	}
	return serverData.localeStrings;
}

// ===========================================================================

function getLocaleCommandStrings(localeId = -1) {
	if (localeId != -1) {
		return serverData.localeCommandStrings[localeId];
	}
	return serverData.localeCommandStrings;
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

/**
 * @return {Array.<LocaleData>} An array of locale data objects
 */
function getLocales() {
	return globalConfig.locale.locales;
}

// ===========================================================================

function getLocaleList() {
	return getLocales().map(function (x) { return x[0]; });
}

// ===========================================================================

function getLocaleData(localeId) {
	if (typeof getLocales()[localeId] != "undefined") {
		return getLocales()[localeId];
	}

	return false;
}

// ===========================================================================

async function translateMessage(messageText, translateFrom = "en", translateTo = "en") {
	return new Promise(resolve => {
		if (translateFrom == translateTo) {
			resolve(messageText);
			return;
		}

		if (typeof cachedTranslations[translateFrom] == "undefined") {
			cachedTranslations[translateFrom] = {};
		}

		if (typeof cachedTranslations[translateFrom][translateTo] == "undefined") {
			cachedTranslations[translateFrom][translateTo] = [];
		}

		for (let i in cachedTranslations[translateFrom][translateTo]) {
			if (cachedTranslations[translateFrom][translateTo][i][0] == messageText) {
				logToConsole(LOG_DEBUG, `[V.RP.Locale] Using existing translation for ${translateFrom} to ${translateTo}: ${messageText} (${cachedTranslations[translateFrom][translateTo][i][1]}`);
				resolve(cachedTranslations[translateFrom][translateTo][i][1]);
				return;
			}
		}

		let thisTranslationURL = globalConfig.locale.translateURL.format(encodeURI(messageText), translateFrom, translateTo, globalConfig.locale.apiEmail);
		httpGet(
			thisTranslationURL,
			"",
			function (data) {
				data = arrayBufferToString(data);
				//tdata = data.substr(0, data.lastIndexOf("}")+1);
				let translationData = null;
				try {
					translationData = JSON.parse(data);
				} catch (e) {
					logToConsole(LOG_ERROR, `[V.RP.Locale] Error parsing translation data (From: ${translateFrom}, To: ${translateTo}, Message: ${messageText}, URL: ${thisTranslationURL}). Error: ${e} in ${e.stack}`);
					resolve(messageText);
					return;
				}

				cachedTranslations[translateFrom][translateTo].push([messageText, translationData.responseData.translatedText]);
				resolve(translationData.responseData.translatedText == messageText ? null : translationData.responseData.translatedText);
				return;
			},
			function (data) {
			}
		);
	});
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

function isTranslationCached(messageText, translateFrom, translateTo) {
	for (let i in cachedTranslations[translateFrom][translateTo]) {
		if (cachedTranslations[translateFrom][translateTo][i][0] == messageText) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getAmountOfLocaleStringsInGroup(localeId, groupName) {
	let localeStrings = getLocaleStringsInGroup(localeId, groupName);

	if (typeof localeStrings == "object") {
		return Object.keys(localeStrings).length;
	} else if (typeof localeStrings == "array") {
		return localeStrings.length;
	}

	return 0;
}

// ===========================================================================

function getLocaleStringsInGroup(localeId, groupName) {
	return getLocaleStrings()[localeId][groupName]
}

// ===========================================================================

function getLocaleCommandName(commandName, localeId = 0) {
	let localeCommandStrings = getLocaleCommandStrings(localeId);
	if (typeof localeCommandStrings[commandName] != "undefined") {
		return localeCommandStrings[commandName].TranslatedCommand;
	}

	return commandName;
}

// ===========================================================================