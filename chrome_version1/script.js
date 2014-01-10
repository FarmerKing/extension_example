(function(){
    Date.MutationObserver = window.WebKitMutationObserver || window.MutationObserver || window.MozMutationObserver || null; 

    if( !Date.MutationObserver ) 
        return ;

    if( document.body.classList.contains("fbIndex") || 
        document.body.classList.contains("UIPage_LoggedOut")) 
        return;

    var mutationObserver  = new Date.MutationObserver(function(mutations){
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
    });

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

    var init = function(){
        if (document.readyState === "complete") {
            //init 
            process(document.body);
            mutationObserver.observe(document.body, { attributeOldValue:true, childList: true, subtree: true, attributes:true });
        }
    };

    //in case the onreadystatechange
    init();

    document.onreadystatechange = function () {
        //in case the onreadystatechange
        init();
    }
})();
