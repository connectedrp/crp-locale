// ===========================================================================
// Connected Roleplay
// https://connected-rp.com
// ===========================================================================
// FILE: server.js
// DESC: Locale for Connected Roleplay servers
// TYPE: Server (JavaScript)
// ===========================================================================

"use strict";

let translatorConfig = null;
let cachedTranslations = [];

exportFunction("isTranslationCached", isTranslationCached);
exportFunction("translateMessage", translateMessage);

// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function (event, resource) {
	mainResource = findResourceByName("crp-gamemode") || findResourceByName("crp-gamemode-test");

	try {
		let configFile = loadTextFile("config/config.json");
		scriptConfig = JSON.parse(configFile);
		if (scriptConfig == null) {
			console.log(`[${thisResource.name}] Could not load config/config.json. Resource stopping ...`);
			thisResource.stop();
			return false;
		}

		let configFile2 = loadTextFile("config/translator.json");
		translatorConfig = JSON.parse(configFile2);
		if (translatorConfig == null) {
			console.log(`[${thisResource.name}] Could not load config/translator.json. Automatic translator will NOT be available!`);
		}

		localeStrings = loadAllLocaleStrings();
		localeCommandStrings = loadAllLocaleCommandStrings();
	} catch (e) {
		console.error(`${e.message} in ${e.stack}`);
	}
});

// ===========================================================================

function checkCommandLocaleStrings(commands) {
	for (let i in commands) {
		let found = localeCommandStrings.some(lcs => {
			if (lcs.Command.toLowerCase().indexOf(commands[i].toLowerCase()) != -1) {
				return true;
			}
		});

		if (!found) {
			localeCommandStrings.push({
				Command: commands[i].Command,
				TranslatedCommand: commands[i].Command,
				Description: commands[i].Description,
				Parameters: commands[i].Parameters,
			});
		}
	}

	// Remove locale command strings that are not in the commands list
	// This is to ensure that we only keep the commands that are currently available
	for (let i in localeCommandStrings) {
		let notFound = commands.some(cmd => {
			if (cmd.Command.toLowerCase().indexOf(localeCommandStrings[i].Command.toLowerCase()) == -1) {
				return true;
			}
		});

		if (notFound) {
			localeCommandStrings.splice(i, 1);
		}
	}

	// Save the updated locale command strings
	saveCommandLocaleStrings(localeCommandStrings);
	localeCommandStrings = localeCommandStrings;
}

// ===========================================================================

function saveCommandLocaleStrings(localeCommandStrings) {
	for (let i in localeCommandStrings) {
		let lcs = localeCommandStrings[i];
		saveTextFile(`locale / command / ${lcs.Locale}.json`, JSON.stringify(lcs));
	}
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
				logToConsole(LOG_DEBUG, `[V.RP.Locale] Using existing translation for ${translateFrom} to ${translateTo}: ${messageText} (${cachedTranslations[translateFrom][translateTo][i][1]} `);
				resolve(cachedTranslations[translateFrom][translateTo][i][1]);
				return;
			}
		}

		let thisTranslationURL = translatorConfig.translateURL.format(encodeURI(messageText), translateFrom, translateTo, translatorConfig.apiEmail);
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
					logToConsole(LOG_ERROR, `[V.RP.Locale] Error parsing translation data(From: ${translateFrom}, To: ${translateTo}, Message: ${messageText}, URL: ${thisTranslationURL}).Error: ${e} in ${e.stack} `);
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

function isTranslationCached(messageText, translateFrom, translateTo) {
	for (let i in cachedTranslations[translateFrom][translateTo]) {
		if (cachedTranslations[translateFrom][translateTo][i][0] == messageText) {
			return true;
		}
	}

	return false;
}

// ===========================================================================