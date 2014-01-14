var process = function(element, isForce){
    isForce = typeof isForce !== 'undefined' ? isForce : false;
    element = typeof element !== 'undefined' ? element : document.body;

    var anchorLike = element.querySelectorAll("a.UFILikeLink");
    for(var i=0; i<anchorLike.length; i++){
        //if isForce is set, it should process anyway
        if( !isForce && anchorLike[i].classList.contains("replaced") ) continue;

        if( anchorLike[i].getAttribute("data-ft") === '{"tn":">"}' ){
            anchorLike[i].innerHTML = chrome.i18n.getMessage("like_button"); //"I know!"; 
            if(isForce)
                chrome.runtime.sendMessage({name: "post_unviewed"});
        }else{
            anchorLike[i].innerHTML = chrome.i18n.getMessage("already_like"); //"aleady viewed!";
            chrome.runtime.sendMessage({name: "post_viewed"});
        }
        anchorLike[i].classList.add("replaced");
    }    
};

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

chrome.runtime.onMessage.addListener(function(message) {
    if( typeof message.name === "undefined") return; 
    switch( message.name){
        case "init":
        console.log("init");
        process();
        mutationObserver.observe(document.body, { childList: true, subtree: true, attributes:true });

        break;
    }
});
