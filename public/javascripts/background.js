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