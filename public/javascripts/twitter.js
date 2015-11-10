console.log("TWITTER CONTENT SCRIPT\n");

var url = "https://localhost:3030";

function callUpdate(){
    console.log("Calling UPDATE\n");
    chrome.runtime.sendMessage({type:"update"});
}

var socket = io.connect(url, {reconnection: false});
socket.on('connect_error', function(){
    console.log("GOT AN ERROR FROM SOCKET.IO CONNECTION ATTEMPT\n");
});

socket.on('hello', function(){
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

            socket.emit('response', {'user': cookieUser, 'public': cookiePublicKey});

            socket.on("info", function(result){
                keys = result.data;

                socket.emit('id', {'name':cookieUser});
                socket.on('name', function(data){
                    var myid = data.id[0].id;
                    var postButton = document.getElementsByClassName("btn primary-btn tweet-action tweet-btn js-tweet-btn");

                    postButton[0].addEventListener("mouseover", function(event){
                        var postField = document.getElementById("tweet-box-home-timeline");
                        var postFieldText = postField.childNodes[0];
                        var postFieldTextInnerText = postFieldText.innerText;
                        var header = postFieldTextInnerText.substring(0,3);
                        if(header !== 'SNP'){
                            var EncryptedMessage = cryptico.encrypt(postFieldTextInnerText, cookiePublicKey);
                            postFieldText.innerText = 'SNP'+'('+myid+')'+EncryptedMessage.cipher;
                        }
                    });

                    postButton[0].addEventListener("click", function(event){
                        callUpdate();
                    });

                    var stream = document.getElementsByClassName("TweetTextSize  js-tweet-text tweet-text");
                    for(var tweet = 0; tweet<stream.length;tweet++){
                        if(stream[tweet].innerText.search("SNP") !== -1){
                            console.log("Found SNP text on ", tweet, stream[tweet].innerText);
                            var id = stream[tweet].innerText.substring(stream[tweet].innerText.indexOf('(')+1, stream[tweet].innerText.indexOf(')'));
                            if(keys.length === 0 && myid === parseInt(id)){
                                console.log("USER HAS NO FRIENDS\n");
                                var cipherText = stream[tweet].innerText.substring(stream[tweet].innerText.indexOf(')')+1, stream[tweet].innerText.length);
                                var DecryptionResult = cryptico.decrypt(cipherText, cookieRSAKey);
                                stream[tweet].innerText = DecryptionResult.plaintext;
                            }
                            if(myid !== undefined && myid === parseInt(id)){
                                var cipherText = stream[tweet].innerText.substring(stream[tweet].innerText.indexOf(')')+1, stream[tweet].innerText.length);
                                var DecryptionResult = cryptico.decrypt(cipherText, cookieRSAKey);
                                stream[tweet].innerText = DecryptionResult.plaintext;
                            }
                            else{
                                for(var key = 0;key<keys.length;key++){
                                    if(keys[key].fid !== undefined){
                                        if(keys[key].fid === parseInt(id)){
                                            var cipherText = stream[tweet].innerText.substring(stream[tweet].innerText.indexOf(')')+1, stream[tweet].innerText.length);
                                            socket.emit('user', {'id': keys[key].fid});
                                            var tempTweet = tweet;
                                            socket.on('rsa', function(data){
                                                var RSAKey = cryptico.generateRSAKey(data.name[0].uname, Bits);
                                                var DecryptionResult = cryptico.decrypt(cipherText, RSAKey);
                                                stream[tempTweet].innerText = DecryptionResult.plaintext;
                                            });
                                        }
                                    }
                                    else if(keys[key].fid2 !== undefined){
                                        if(keys[key].fid2 === parseInt(id)){
                                            var cipherText = stream[tweet].innerText.substring(stream[tweet].innerText.indexOf(')')+1, stream[tweet].innerText.length);
                                            socket.emit('user', {'id': keys[key].fid2});
                                            var tempTweet = tweet;
                                            socket.on('rsa', function(data){
                                                var RSAKey = cryptico.generateRSAKey(data.name[0].uname, Bits);
                                                var DecryptionResult = cryptico.decrypt(cipherText, RSAKey);
                                                stream[tempTweet].innerText = DecryptionResult.plaintext;
                                            });
                                        }
                                    }
                                    else{
                                        console.log("User is not the sender or friends with the sender!\n");
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
        else{
            console.log('NO SESSION!');
        }
    });
});
