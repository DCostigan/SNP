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


chrome.tabs.query({"url": "https://www.facebook.com/*"}, function (tabs) {
    console.log("Facebook Tabs: ", tabs);
    if(tabs.length === 0) return;
    for(var i=0; i<tabs.length;i++){
        if(tabs[i].active === true){
            console.log("Active Facebook Session on array element: ", i);
        }
    }
});

chrome.tabs.query({"url": "https://twitter.com/*"}, function (tabs) {
    console.log("Twitter Tabs: ", tabs);
    if(tabs.length === 0) return;
    for(var i=0; i<tabs.length;i++){
        if(tabs[i].active === true){
            console.log("Active Twitter Session on array element: ", i);
        }
    }
});