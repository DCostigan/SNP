function openHome (){
    chrome.tabs.create({ url: "http://localhost:3000" });
}

function openSettings (){
    //SHOULD CLOSE ALL OPEN SETTINGS
    chrome.tabs.create({url: "http://localhost:3000/home"});
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
    var activeSession = 0;
    var cookieUser = '';
    renderHeader();
    var settings = document.getElementById('settings');
    var pause = document.getElementById('pause');
    var sign = document.getElementById('sign');

    //IF THERE ARE COOKIES
    var port = chrome.runtime.connect({name: "bkgrd"});
    port.onMessage.addListener(function(msg){
        if(msg.uname){
            console.log('USER SESSION: ' + msg.uname);
            activeSession = 1;
            var div = document.getElementById('status');
            //GET USERNAME FROM COOKIES
            cookieUser = msg.uname;
            var text = document.createTextNode(cookieUser);
            div.appendChild(text);
        }
        else{
            console.log('NO SESSION!');
            var div = document.getElementById('status');
        }
    });

    settings.addEventListener('click', function (){
        if(activeSession)
            openSettings();
        else
            openHome();
    });

    pause.addEventListener('click', function (){
        console.log("Entered Paused State");
        pausedFlag = !pausedFlag;
        setPause(pausedFlag);
    });

}, function(errorMessage) {
    console.log(errorMessage);
});

