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
		this.englishName = "";
		this.stringsFile = "";
		this.flagImagePath = "";
		this.contributors = "";
		this.countries = [];
		this.requiresUnicode = false;
	}
}

// ===========================================================================

let scriptConfig = null;
let localeStrings = [];
let localeCommandStrings = [];
let mainResource = null;

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
exportFunction("getAmountOfLocaleStringsInGroup", getAmountOfLocaleStringsInGroup);
exportFunction("getLocaleStringsInGroup", getLocaleStringsInGroup);
exportFunction("getLocaleCommandName", getLocaleCommandName);
exportFunction("getLocales", getLocales);
exportFunction("getDefaultLanguageId", getDefaultLanguageId);

// ===========================================================================

function getLocaleString(localeId, stringName, ...args) {
	let tempString = getRawLocaleString(localeId, stringName);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		mainResource.exports.logToConsole(LOG_WARN, `[${thisResource.name}] Locale string missing for ${stringName} on language ${getLocaleData(localeId).englishName}`);
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
		mainResource.exports.logToConsole(LOG_WARN, `[${thisResource.name}] Locale string missing for index ${index} of "${stringName}" on language ${getLocaleData(localeId).englishName}`);
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
		logToConsole(LOG_WARN, `[${thisResource.name}] Locale string missing for ${getLocaleStrings()[localeId][stringName]} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Locale string is missing for "${getLocaleStrings()[localeId][stringName]}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	return getLocaleStrings()[localeId][stringName];
}

// ===========================================================================

function getRawGroupedLocaleString(localeId, stringName, index) {
	if (typeof getLocaleStrings()[localeId][stringName] == "undefined") {
		logToConsole(LOG_ERROR, `[${thisResource.name}] Grouped locale string missing for string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Grouped locale string is missing for string "${stringName}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
	}

	if (typeof getLocaleStrings()[localeId][stringName][index] == "undefined") {
		logToConsole(LOG_ERROR, `[${thisResource.name}] Grouped locale string missing for index ${index} of string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Grouped locale string is missing for index ${index} of string "${stringName}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
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
		logToConsole(LOG_ERROR, `[${thisResource.name}] Locale ID ${localeId} does not exist!`);
		return getLocales()[scriptConfig.defaultLanguageId].isoCode;
	}

	return getLocales()[localeId].isoCode;
}

// ===========================================================================

function loadAllLocaleStrings() {
	let tempLocaleStrings = {};

	let locales = getLocales();
	for (let i in locales) {
		let localeData = locales[i];
		let textFile = loadTextFile(`text/${localeData.stringsFile}`);
		if (textFile == "") {
			throw Error(`${thisResource.name} File for text strings for ${localeData.englishName} missing`);
			continue;
		}
		let localeFile = JSON.parse(textFile);
		tempLocaleStrings[localeData.id] = localeFile;
	}

	return tempLocaleStrings;
}

// ===========================================================================

function loadAllLocaleCommandStrings() {
	let tempLocaleStrings = {};

	let locales = getLocales();
	for (let i in locales) {
		let localeData = locales[i];
		let textFile = loadTextFile(`command/${localeData.stringsFile}`);
		if (textFile == "") {
			throw Error(`${thisResource.name} File for command strings for ${localeData.englishName} missing`);
			continue;
		}
		let localeFile = JSON.parse(textFile);
		tempLocaleStrings[localeData.id] = localeFile;
	}

	return tempLocaleStrings;
}

// ===========================================================================

function getLocaleStrings(localeId = -1) {
	if (localeId != -1) {
		return localeStrings.find(locale => locale.id == localeId);
	}
	return localeStrings;
}

// ===========================================================================

function getLocaleCommandStrings(localeId = -1) {
	if (localeId != -1) {
		return localeCommandStrings.find(locale => locale.id == localeId);
	}
	return localeCommandStrings;
}

// ===========================================================================

function getLocaleFromParams(params) {
	let locales = getLocales();
	if (isNaN(params)) {
		for (let i in locales) {
			if (locales[i].isoCode.toLowerCase().indexOf(toLowerCase(params)) != -1) {
				return locales[i].id;
			}

			if (locales[i].englishName.toLowerCase().indexOf(toLowerCase(params)) != -1) {
				return locales[i].id;
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
	return scriptConfig;
}

// ===========================================================================

function getLocaleList() {
	return getLocales().map(function (x) { return x.englishName; });
}

// ===========================================================================

function getLocaleData(localeId) {
	return getLocales().find(locale => locale.id == localeId) || null;
}

// ===========================================================================

function getLocaleFromCountryISO(isoCode = "US") {
	let locales = getLocales();
	for (let i in locales) {
		for (let j in locales[i].countries) {
			if (locales[i].countries[j].toLowerCase() == isoCode.toLowerCase()) {
				return locales[i].id;
			}
		}
	}
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
	return getLocaleStrings(localeId)[groupName];
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

function getDefaultLanguageId() {
	return scriptConfig.defaultLanguageId;
}

// ===========================================================================