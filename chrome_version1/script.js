var mutationHandler = function(mutations){
    var isSkipChildList = false;
    mutations.forEach(function(mutation) {
        if(mutation.type !== "childList"){
            if( mutation.target.classList.contains("UFILikeLink") && 
                mutation.attributeName === "data-ft"){
                process(mutation.target.parentElement,true);
            }
        }else if(isSkipChildList){
        }else if( mutation.target.tagName.toLowerCase() === "div" && 
                  (mutation.target.classList.contains("_5pcb") || 
                   mutation.target.classList.contains("_4ikz")) ){
            process();
            isSkipChildList=true;
        }
    });
};
var mutationObserver  = new MutationObserver(mutationHandler);

var process = function(element,isForce){
    element = typeof element !== 'undefined' ? element : document;
    isForce = typeof isForce !== 'undefined' ? isForce : false;

    var nodeList = element.querySelectorAll("a.UFILikeLink");
    for (var i = 0; i < nodeList.length; ++i) {
        var node = nodeList[i]; 

        if( !isForce && node.classList.contains("replaced")) continue;
        if( node.getAttribute("data-ft") === '{"tn":">"}' ){
            node.innerHTML = chrome.i18n.getMessage("like_button"); //"I know!"; 
        }else{
            node.innerHTML = chrome.i18n.getMessage("already_like"); //"aleady viewed!"; 
        }

        node.classList.add("replaced");
    }
};

process();
mutationObserver.observe(document.body, { childList: true, subtree: true, attributes:true });

