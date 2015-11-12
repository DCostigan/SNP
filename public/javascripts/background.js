
chrome.runtime.onConnect.addListener(function(port){
   console.assert(port.name == 'bkgrd');
    var sendMessage = 0;
    chrome.cookies.getAll({}, function(cookies) {
        for (var i in cookies) {
            if (cookies[i].name === 'http://localhost:3000') {
                sendMessage = 1;
                port.postMessage({uname: cookies[i].value});
            }
        }
        if(!sendMessage){
            port.postMessage({});
        }
    });
});

chrome.runtime.onConnect.addListener(function(port){
    console.assert(port.name == 'twitter');
    var sendMessage = 0;
    chrome.cookies.getAll({}, function(cookies) {
        for (var i in cookies) {
            if (cookies[i].name === 'http://localhost:3000') {
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

chrome.runtime.onMessage.addListener(function(message){
    console.log(message.type);
    if(message.type === 'update') {
        console.log("GOT THE MESSAGE\n");
        var updateProperties = {'active': false};
        var updateProperties2 = {'active': true};
        chrome.tabs.query({'active': true}, function (activeTabs) {
            var activeTab = activeTabs[0];
            chrome.tabs.update(activeTab.id, updateProperties, function () {
                console.log("FINISHED UPDATE ONE\n");
                chrome.tabs.update(activeTab.id, updateProperties2, function () {
                    console.log("FINISHED UPDATE TWO\n");
                });
            });
        });
    }
    if(message.type === 'delete'){
        chrome.tabs.query({'active': true}, function (activeTabs) {
            var activeTab = activeTabs[0];
            chrome.tabs.executeScript(activeTab.id, {file: "/socket.io-client-1.3.7/socket.io.js"}, function() {
                console.log("Finished socket.io script execution!\n");
                chrome.tabs.executeScript(activeTab.id, {file: "/cryptico-master/cryptico.min.js"}, function () {
                    console.log("Finished cryptico.min.js script execution in DELETE!\n");
                    chrome.tabs.executeScript(activeTab.id, {file: "/public/javascripts/twitter.js"}, function () {
                        console.log("Finished twitter script execution in DELETE!\n");
                    });
                });
            });
        });
    }
});

function checkWebsite(tab){
    var fbtabexists = 0;
    var twtabexists = 0;
    var regExpTwitter = /https?:\/\/twitter.com\/(.*)$/;
    var regExpFacebook = /https?:\/\/facebook.com\/(.*)$/;
    //if(tab.url === "https://www.facebook.com/"){
    if(regExpFacebook.test(tab.url)){
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
    }
        //NOT FACEBOOK
    //if(tab.url === "https://twitter.com/"){
    if(regExpTwitter.test(tab.url)){
        chrome.tabs.executeScript(tab.id, {file: "/socket.io-client-1.3.7/socket.io.js"}, function(){
            console.log("Finished socket.io script execution!\n");
            chrome.tabs.executeScript(tab.id, {file: "/cryptico-master/cryptico.min.js"}, function(){
                console.log("Finished cryptico.min.js script execution!\n");
                    chrome.tabs.executeScript(tab.id, {file: "/public/javascripts/twitter.js"}, function () {
                        console.log("Finished twitter script execution!\n");
                    });
            });
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
        //NOT TWITTER
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
                    //KEEP TAB AS FACEBOOK
                }
                else {
                    //REMOVING FACEBOOK TAB
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
                    //KEEP TAB AS TWITTER
                }
                else {
                    //REMOVING TWITTER TAB
                    tabIDTwitter.splice(i, 1);
                }
            }
        }
    }
    if(newTab && changeInfo && changeInfo.status === 'complete'){
        if(tab.url === "https://www.facebook.com/") {
            //ADDING FACEBOOK TAB
            tabIDFacebook.push(tab.id);
        }
        if(tab.url === "https://twitter.com/") {
            //REMOVING FACEBOOK TAB
            tabIDTwitter.push(tab.id);
        }
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
    console.log("Entering onRemoved");
   for(var i in tabIDFacebook){
       if(tabId === tabIDFacebook[i]){
           //FACEBOOK TAB WAS DELETED
           tabIDFacebook.splice(i, 1);
       }
   }
    for(var i in tabIDTwitter){
        if(tabId === tabIDTwitter[i]){
            //TWITTER TAB WAS DELETED
            tabIDTwitter.splice(i, 1);
        }
    }
});