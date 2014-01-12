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

chrome.runtime.onInstalled.addListener(function(details){
    //reason ( enum of "install", "update", or "chrome_update" )
    chrome.browserAction.setBadgeText({"text": "0"});
} );
