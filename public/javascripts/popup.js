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

    //IF THERE ARE COOKIES
    if(1){
        var div = document.getElementById('status');
        //GET USERNAME FROM COOKIES
        var cookieUser = "dcostigan@umass.edu";
        var text = document.createTextNode(cookieUser);
        div.appendChild(text);
        var input = document.getElementById('sign');
        input.setAttribute('value', 'Sign Out');
    }
    //IF THERE ARE NO COOKIES
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

