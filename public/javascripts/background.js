chrome.runtime.onConnect.addListener(function(port){
   console.assert(port.name == 'bkgrd');
    var sendMessage = 0;
    chrome.cookies.getAll({}, function(cookies) {
        for (var i in cookies) {
            if (cookies[i].domain === 'localhost') {
                sendMessage = 1;
                port.postMessage({uname: cookies[i].value});
            }
        }
        if(!sendMessage){
            port.postMessage({});
        }
    });
});

var tabIDFacebook = [];
var tabIDTwitter = [];

function checkWebsite(tab){
    var fbtabexists = 0;
    var twtabexists = 0;
    if(tab.url === "https://www.facebook.com/"){
        console.log("Facebook\n");
        console.log(tab.id);
        chrome.tabs.executeScript(tab.id, {file: "/public/javascripts/facebook.js"}, function(){
            console.log("Finished facebook script execution!\n");
        });
        for(var index in tabIDFacebook){
            if(tabIDFacebook[index] === tab.id){
                fbtabexists = 1;
            }
        }
        if(!fbtabexists){
            tabIDFacebook.push(tab.id);
        }
    }
    else{
        console.log("Not Facebook\n");
    }
    if(tab.url === "https://twitter.com/"){
        console.log("Twitter\n");
        console.log(tab.id);
        chrome.tabs.executeScript(tab.id, {file: "/public/javascripts/twitter.js"}, function(){
            console.log("Finished twitter script execution!\n");
        });
        for(var index in tabIDTwitter){
            if(tabIDTwitter[index] === tab.id){
                twtabexists = 1;
            }
        }
        if(!twtabexists){
            tabIDTwitter.push(tab.id);
        }
    }
    else{
        console.log("Not Twitter\n");
    }
}

chrome.tabs.onActivated.addListener(function(activeInfo){
    console.log("Entering onActivated Listener\n");
    chrome.tabs.get(activeInfo.tabId, function(tab){
        checkWebsite(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    console.log("Entering onUpdated Listener!\n");
    chrome.tabs.query({'active': true}, function (activeTabs){
        var activeTab = activeTabs[0];
        if(activeTab.id === tab.id){
            checkWebsite(activeTab);
        }
    });
    var newTab = 1;
    for(var i in tabIDFacebook){
        if(tabId === tabIDFacebook[i]){
            newTab = 0;
            if(changeInfo && changeInfo.status === 'complete'){
                if(tab.url === "https://www.facebook.com/"){
                    //KEEP ID IN CACHE
                    console.log("Keeping tab as Facebook\n");
                }
                else {
                    console.log("Removing tab as it is no longer facebook\n");
                    tabIDFacebook.splice(i, 1);
                }
            }
        }
    }
    for(var i in tabIDTwitter){
        if(tabId === tabIDTwitter[i]){
            newTab = 0;
            if(changeInfo && changeInfo.status === 'complete'){
                if(tab.url === "https://twitter.com/"){
                    //KEEP ID IN CACHE
                    console.log("Keeping tab as Twitter\n");
                }
                else {
                    console.log("Removing tab as it is no longer twitter\n");
                    tabIDTwitter.splice(i, 1);
                }
            }
        }
    }
    if(newTab && changeInfo && changeInfo.status === 'complete'){
        if(tab.url === "https://www.facebook.com/") {
            console.log("Adding new Facebook tab\n");
            tabIDFacebook.push(tab.id);
        }
        if(tab.url === "https://twitter.com/") {
            console.log("Adding new Twitter tab\n");
            tabIDTwitter.push(tab.id);
        }
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
    console.log("Entering onRemoved");
   for(var i in tabIDFacebook){
       if(tabId === tabIDFacebook[i]){
           console.log("Removed Facebook tab");
           tabIDFacebook.splice(i, 1);
       }
   }
    for(var i in tabIDTwitter){
        if(tabId === tabIDTwitter[i]){
            console.log("Removed Twitter tab");
            tabIDTwitter.splice(i, 1);
        }
    }
});