// ===========================================================================
// Connected Roleplay
// https://connected-rp.com
// ===========================================================================
// FILE: server.js
// DESC: Locale for Connected Roleplay servers
// TYPE: Server (JavaScript)
// ===========================================================================

"use strict";

// ===========================================================================

let resourceStarted = false;
let resourceReady = false;
let resourceInit = false;

let localeCommandStrings = [];
let localeStrings = [];

// ===========================================================================

exportFunction("getLocaleString", getLocaleString);
exportFunction("getGroupedLocaleString", getLocaleString);
exportFunction("checkCommandLocaleStrings", checkCommandLocaleStrings);

// ===========================================================================



// ===========================================================================

bindEventHandler("OnResourceStop", thisResource, function (event, resource) {
});

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
        let localeFile = JSON.parse(loadTextFile(`text/${localeData.stringsFile}`));
        tempLocaleStrings[localeData.id] = localeFile;
    }

    return tempLocaleStrings;
}

// ===========================================================================

function loadAllCommandLocaleStrings() {
    let tempLocaleCommandStrings = {};

    let locales = globalConfig.locale.locales;
    for (let i in locales) {
        let localeData = locales[i];
        let localeFile = JSON.parse(loadTextFile(`commands/${localeData.stringsFile}`));
        tempLocaleCommandStrings[localeData.id] = localeFile;
    }

    return tempLocaleCommandStrings;
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

function getLocaleCommandStrings(localeId = -1) {
    if (localeId != -1) {
        return serverData.localeCommandStrings[localeId];
    }
    return serverData.localeCommandStrings;
}

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
    serverData.localeCommandStrings = localeCommandStrings;
}

// ===========================================================================

function saveCommandLocaleStrings(localeCommandStrings) {
    for (let i in localeCommandStrings) {
        let lcs = localeCommandStrings[i];
        saveTextFile(`locale/command/${lcs.Locale}.json`, JSON.stringify(lcs));
    }
}
