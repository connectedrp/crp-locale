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
