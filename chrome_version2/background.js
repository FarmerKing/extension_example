/*
chrome.browserAction.onClicked.addListener(function(tab){
    chrome.browserAction.getBadgeText({}, function(result) {
        var prevCount = 0 ;
        if( result.trim() !== "" ){
            prevCount = parseInt(result,10);
        }
        prevCount++;

        chrome.browserAction.setBadgeText({"text": prevCount.toString(10)});
    });
});
*/



chrome.runtime.onMessage.addListener(function(message) {
    if( typeof message.name === "undefined") return; 
    switch( message.name){
        case "post_viewed":
        chrome.browserAction.getBadgeText({}, function(result) {
            var prevCount = 0 ;
            if( result.trim() !== "" ){
                prevCount = parseInt(result,10);
            }
            prevCount++;

            chrome.browserAction.setBadgeText({"text": prevCount.toString(10)});
        });
        break;
        case "post_unviewed":
        chrome.browserAction.getBadgeText({}, function(result) {
            var prevCount = 0 ;
            if( result.trim() !== "" ){
                prevCount = parseInt(result,10);
            }

            if( prevCount > 0 )
                prevCount--;

            chrome.browserAction.setBadgeText({"text": prevCount.toString(10)});
        });
        break;
    }
});

chrome.runtime.onInstalled.addListener(function(details){
    //reason ( enum of "install", "update", or "chrome_update" )
    chrome.browserAction.setBadgeText({"text": "0"});
} );

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    var current = new Date();
    console.log("tabs.onUpdated(" + tab.url + ")(" + changeInfo.status + ")");
    var tabLocation = document.createElement('a');
    tabLocation.href= tab.url;

    if( changeInfo.status === "complete" &&
        typeof tabLocation.hostname !== "undefined" &&
        tabLocation.hostname === "www.facebook.com" && 
        typeof tabLocation.pathname !== "undefined" && 
        tabLocation.pathname === "/")
    {
        console.log("tab.onUpdated complete(" + current.toString() + ":" + current.getUTCMilliseconds() +")");
        chrome.browserAction.setBadgeText({"text": "0"});        

        //notify the contentscript to start init 
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {name: "init"});
        });
    }
});



