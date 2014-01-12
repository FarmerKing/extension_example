var process = function(element){
    var nodeList = element.querySelectorAll("a.UFILikeLink");
    for (var i = 0; i < nodeList.length; ++i) {
        var node = nodeList[i]; 
        if( node.getAttribute("data-ft") === '{"tn":">"}' ){
            node.innerHTML = chrome.i18n.getMessage("like_button"); //"I know!"; 
        }else{
            node.innerHTML = chrome.i18n.getMessage("already_like"); //"aleady viewed!"; 
        }
    }
};

process(document.body);

new MutationObserver(function(mutations){
    mutations.forEach(function(mutation) {
        switch( mutation.type){
        case "attributes": 
            if( typeof mutation.target.className !== "undefined" && 
                mutation.target.className === "UFILikeLink" && 
                mutation.attributeName === "data-ft"){
                process(mutation.target.parentElement);
            }
            break; 
        case "childList": 
            process( mutation.target );
            break;
        }
    });
}).observe(document.body, { attributeOldValue:true, childList: true, subtree: true, attributes:true });
