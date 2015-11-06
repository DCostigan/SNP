console.log("TWITTER CONTENT SCRIPT\n");

var url = "https://localhost:3030";


var socket = io.connect(url, {reconnection: false});
socket.on('connect_error', function(){
    console.log("GOT AN ERROR FROM SOCKET.IO CONNECTION ATTEMPT\n");
});

socket.on('hello', function(){
    console.log("GOT HELLO FROM SERVER\n");
    var port = chrome.runtime.connect({name: "twitter"});
    port.onMessage.addListener(function(msg){
        if(msg.uname){
            var cookieUser = '';
            var keys = [];
            console.log('USER SESSION: ' + msg.uname);
            cookieUser = msg.uname;
            cookieUser = cookieUser.substring(0, cookieUser.indexOf(','));

            var Bits = 512;
            var cookieRSAKey = cryptico.generateRSAKey(cookieUser, Bits);
            var cookiePublicKey = cryptico.publicKeyString(cookieRSAKey);

            console.log(cookiePublicKey.length);
            console.log(cookiePublicKey);

            socket.emit('response', {'user': cookieUser, 'public': cookiePublicKey});

            socket.on("info", function(result){
                console.log("GOT INFO FROM SERVER\n");
                keys = result.data;

                var postButton = document.getElementsByClassName("btn primary-btn tweet-action tweet-btn js-tweet-btn");

                postButton[0].addEventListener("mouseover", function(event){
                    var postField = document.getElementById("tweet-box-home-timeline");
                    var postFieldText = postField.childNodes[0];
                    postFieldText.innerText = "jumbled text";
                });

                var stream = document.getElementsByClassName("TweetTextSize  js-tweet-text tweet-text");
                for(var tweet = 0; tweet<stream.length;tweet++){
                    if(stream[tweet].innerText.search("jumbled") !== -1){ //SEARCH CUTS OFF THE FIRST CHARACTER
                        console.log("Found jumbled text on ", tweet, stream[tweet].innerText);
                        stream[tweet].innerText = "GOTCHA!";
                    }
                }
            });
        }
        else{
            console.log('NO SESSION!');
        }
    });
});
