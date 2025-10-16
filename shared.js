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
		this.enabled = true;
	}
}

exportFunction("code", function (code) {
	let returnValue = "Nothing";
	try {
		returnValue = eval("(" + code + ")");
	} catch (error) {
		message(`[CRP.HUD] The code could not be executed! Error: ${error.message} in ${error.stack}`);
		return false;
	}

	return returnValue;
});

// ===========================================================================

let scriptConfig = null;
let localeStrings = {};
let localeCommandStrings = {};
let mainResource = null;

exportFunction("getLocaleString", getLocaleString);
exportFunction("getRawLocaleString", getRawLocaleString);
exportFunction("getGroupedLocaleString", getGroupedLocaleString);
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

function getLocaleString(localeId, stringName, args) {
	let tempString = getRawLocaleString(localeId, stringName);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		mainResource.exports.logToConsole(mainResource.exports.getLogLevels().Warn, `[${thisResource.name}] Locale string missing for ${stringName} on language ${getLocaleData(localeId).englishName}`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Locale string "${stringName}" is missing for "${getLocaleData(localeId).englishName}"`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	if (typeof tempString == "string" && typeof args != "undefined") {
		for (let i = 1; i <= args.length; i++) {
			tempString = tempString.replace(`{${i}}`, args[i - 1]);
		}
	}

	return tempString;
}

// ===========================================================================

function getGroupedLocaleString(localeId, stringName, index, args) {
	let tempString = getRawGroupedLocaleString(localeId, stringName, index);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		mainResource.exports.logToConsole(mainResource.exports.getLogLevels().Warn, `[${thisResource.name}] Locale string missing for index ${index} of "${stringName}" on language ${getLocaleData(localeId).englishName}`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Locale string index ${index} of "${stringName}" is missing for "${getLocaleData(localeId).englishName}"`);
		return `${getLocaleData(localeId).englishName} locale message missing for index "${index}" of "${stringName}" (reported to developer)`;
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

/**
 *
 * @param {Number} localeId
 * @param {String} stringName
 * @returns {String} stringText
 */
function getRawLocaleString(localeId, stringName) {
	if (typeof getLocaleStrings(localeId)[stringName] == "undefined") {
		mainResource.exports.logToConsole(mainResource.exports.getLogLevels().Warn, `[${thisResource.name}] Locale string missing for ${getLocaleStrings(localeId)[stringName]} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Locale string is missing for "${getLocaleStrings(localeId)[stringName]}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	return getLocaleStrings(localeId)[stringName];
}

// ===========================================================================

/**
 *
 * @param {Number} localeId
 * @param {String} stringName
 * @param {Number} localeId
 * @returns {String} stringText
 */
// ===========================================================================

function getRawGroupedLocaleString(localeId, stringName, index) {
	if (typeof getLocaleStrings(localeId)[stringName] == "undefined") {
		mainResource.exports.logToConsole(LOG_ERROR, `[${thisResource.name}] Grouped locale string missing for string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Grouped locale string is missing for string "${stringName}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
	}

	if (typeof getLocaleStrings(localeId)[stringName][index] == "undefined") {
		mainResource.exports.logToConsole(LOG_ERROR, `[${thisResource.name}] Grouped locale string missing for index ${index} of string ${stringName} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		mainResource.exports.submitBugReport(null, `(AUTOMATED REPORT) Grouped locale string is missing for index ${index} of string "${stringName}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return `${getLocaleData(localeId).englishName} locale message missing for "${stringName}" (reported to developer)`;
	}

	return getLocaleStrings(localeId)[stringName][index];
}

// ===========================================================================

/**
 *
 * @param {Number} localeId
 * @returns {String} locale name
 */
function getLocaleName(localeId) {
	if (getLocaleData(localeId) == null) {
		//mainResource.exports.logToConsole(["Errpr"], `[${thisResource.name}] Locale ID ${localeId} does not exist!`);
		return "";
	}
	return getLocaleData(localeId).englishName;
}

// ===========================================================================

/**
 *
 * @param {Number} localeId
 * @returns {String} locale ISO code
 */
function getLocaleISO(localeId) {
	if (getLocaleData(localeId) == null) {
		//mainResource.exports.logToConsole(["Errpr"], `[${thisResource.name}] Locale ID ${localeId} does not exist!`);
		return getLocaleData(scriptConfig.defaultLanguageId).isoCode;
	}

	return getLocaleData(localeId).isoCode;
}

// ===========================================================================

function loadAllLocaleStrings() {
	let tempLocaleStrings = {};

	let locales = getLocales().filter(locale => locale.enabled == true && locale.requiresUnicode == false);
	for (let i in locales) {
		try {
			let localeData = locales[i];
			console.log(`[${thisResource.name}] Loading strings for ${localeData.englishName} from text/${localeData.stringsFile}`);
			let textFile = loadTextFile(`text/${localeData.stringsFile}`);
			if (textFile == "") {
				console.error(`[${thisResource.name}] File for text strings for ${localeData.englishName} missing`);
				continue;
			}
			let tempStrings = JSON.parse(textFile);
			tempLocaleStrings[localeData.id] = tempStrings;
			console.log(`[${thisResource.name}] ${Object.keys(tempStrings).length} text strings loaded for ${localeData.englishName}!`);
		} catch (err) {
			console.error(`[${thisResource.name}] Error loading strings for ${localeData.englishName}: ${err.message} in ${err.stack}`);
		}
	}

	return tempLocaleStrings;
}

// ===========================================================================

function loadAllLocaleCommandStrings() {
	let tempLocaleStrings = {};

	let locales = getLocales();
	for (let i in locales) {
		let localeData = locales[i];
		console.log(`[${thisResource.name}] Loading command strings for ${localeData.englishName} from command/${localeData.stringsFile}`);
		let textFile = loadTextFile(`command/${localeData.stringsFile}`);
		if (textFile == "") {
			console.error(`[${thisResource.name}] File for command strings for ${localeData.englishName} missing`);
			continue;
		}
		let tempStrings = JSON.parse(textFile);
		tempLocaleStrings[localeData.id] = tempStrings;
		let count = 0;
		if (tempStrings != null) {
			count = Object.keys(tempStrings).length;
		}
		console.log(`[${thisResource.name}] ${count} command strings loaded for ${localeData.englishName}!`);
	}

	return tempLocaleStrings;
}

// ===========================================================================

function getLocaleStrings(localeId = -1) {
	if (typeof localeStrings[localeId] == "undefined") {
		return null;
	}
	return localeStrings[localeId];
}

// ===========================================================================

function getLocaleCommandStrings(localeId = -1) {
	if (typeof localeCommandStrings[localeId] == "undefined") {
		return null;
	}
	return localeCommandStrings[localeId];
}

// ===========================================================================

function getLocaleFromParams(params) {
	let locales = getLocales();
	if (isNaN(params)) {
		for (let i in locales) {
			if (locales[i].isoCode.toLowerCase().indexOf(params.toLowerCase()) != -1) {
				return locales[i].id;
			}

			if (locales[i].englishName.toLowerCase().indexOf(params.toLowerCase()) != -1) {
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
	return 0;
}

// ===========================================================================

String.prototype.format = function () {
	let a = this;
	for (let i in arguments) {
		a = a.replace("{" + String(i) + "}", arguments[i]);
	}
	return a;
}

// ===========================================================================

function arrayBufferToString(arrayBuffer) {
	return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}