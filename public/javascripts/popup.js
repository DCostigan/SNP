//function loadScript(url, callback) {
//    // Adding the script tag to the head as suggested before
//    var head = document.getElementsByTagName('head')[0];
//    var script = document.createElement('script');
//    script.type = 'text/javascript';
//    script.src = url;
//
//    // Then bind the event to the callback function.
//    // There are several events for cross browser compatibility.
//    script.onreadystatechange = callback;
//    script.onload = callback;
//
//    // Fire the loading
//    head.appendChild(script);
//}
//
//document.addEventListener('DOMContentLoaded', function() {
//    console.log('HelloApp!' + '\n');
//    renderHeader();
//    renderPublic('Your Public Key: ');
//    renderTextField();
//    //createButtonTypes( function (){
//    //    renderButton();
//    //});
//    renderButton();
//    //loadScript("/public/javascripts/snp-index.js", populateList);
//    renderList();
//    //loadScript("/public/javascripts/snp-index.js", buttonCreation);
//
//
//
//}, function(errorMessage) {
//      renderStatus('Cannot display settings. ' + errorMessage);
//});

function openSettings (){
    chrome.tabs.create({ url: "http://localhost:3000" });
}

function setPause (state){
    var pauseFlag = state;
    var input = document.getElementById('pause');
    if(pauseFlag)
        input.setAttribute('value', 'Unpause');
    else
        input.setAttribute('value', 'Pause');
}

function renderHeader(){
    var header = document.getElementById('header');
    var logo = document.createElement('img');
    //logo.src = 'public/images/icon4.png';
    logo.setAttribute("src", "/public/images/icon4.png");
    logo.setAttribute("height", "64");
    logo.setAttribute("width", "64");
    logo.setAttribute("alt", "Logo");
    var h2 = document.createElement('h2');
    var text = document.createTextNode('Social Network Privacy');
    h2.appendChild(text);
    header.appendChild(logo);
    header.appendChild(h2);
}


document.addEventListener('DOMContentLoaded', function() {
    var pausedFlag = 0;
    renderHeader();
    var settings = document.getElementById('settings');
    var pause = document.getElementById('pause');

    if(1){
        var div = document.getElementById('status');
        //GET USERNAME FROM COOKIES
        var cookieUser = "dcostigan@umass.edu";
        var text = document.createTextNode(cookieUser);
        div.appendChild(text);
        var input = document.getElementById('sign');
        input.setAttribute('value', 'Sign Out');
    }
    else {
        var div = document.getElementById('status');
        var input = document.getElementById('sign');
        input.setAttribute('value', 'Sign In');
    }

    settings.addEventListener('click', function (){
        openSettings();
    });

    pause.addEventListener('click', function (){
        console.log("Entered Paused State");
        pausedFlag = !pausedFlag;
        setPause(pausedFlag);
    });

}, function(errorMessage) {
    console.log(errorMessage);
});

