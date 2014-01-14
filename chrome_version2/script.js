var viewedPost = {}; //keyword-post dedupe mechanism

var process = function(element, isForce){
    isForce = typeof isForce !== 'undefined' ? isForce : false;
    element = typeof element !== 'undefined' ? element : document.body;

    var anchorLike = element.querySelectorAll("a.UFILikeLink");
    for(var i=0; i<anchorLike.length; i++){
        //if isForce is set, it should process anyway
        if( !isForce && anchorLike[i].classList.contains("king_processed") ) continue;

        if( anchorLike[i].getAttribute("data-ft") === '{"tn":">"}' ){
            anchorLike[i].innerHTML = chrome.i18n.getMessage("like_button"); //"I know!"; 
            if(isForce)
                chrome.runtime.sendMessage({name: "post_unviewed"});
        }else{
            anchorLike[i].innerHTML = chrome.i18n.getMessage("already_like"); //"aleady viewed!";
            chrome.runtime.sendMessage({name: "post_viewed"});
        }
        if(!anchorLike[i].classList.contains("king_processed"))
            anchorLike[i].classList.add("king_processed");
    }    
};

var mutationHandler = function(mutations){
    var isSkipChildList = false;
    mutations.forEach(function(mutation) {
        switch( mutation.type){
        case "attributes": 
            if( mutation.target.classList.contains("UFILikeLink") && 
                mutation.attributeName === "data-ft"){
                process(mutation.target.parentElement,true);
            }
            break; 
        case "childList": 
            if(mutation.target.tagName.toLowerCase() === "div" && 
               mutation.target.classList.contains("_5pcb") ){
                //if( !isSkipChildList ){
                    process(mutation.target);
                    //isSkipChildList = true; 
                //}
            }
            break;
        }
    });
};

var mutationObserver = new MutationObserver(mutationHandler);

chrome.runtime.onMessage.addListener(function(message) {
    if( typeof message.name === "undefined") return; 
    switch( message.name){
        case "init":
        console.log("init");
        process(document.body);
        //process5jmm(document.body);
        mutationObserver.observe(document.body, { attributeOldValue:true, childList: true, subtree: true, attributes:true });

        break;
    }
});
