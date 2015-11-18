console.log("FACEBOOK CONTENT SCRIPT\n");

var url = "https://localhost:3030";

var mouseClickUpdate = false;

var socket = io.connect(url, {reconnection: false});
socket.on('connect_error', function(){
    console.log("GOT AN ERROR FROM SOCKET.IO CONNECTION ATTEMPT\n");
});

socket.on('hello', function(){
    var port = chrome.runtime.connect({name: "facebook"});
    port.onMessage.addListener(function(msg) {
        if (msg.uname) {
            var cookieUser = '';
            var keys = [];
            console.log('USER SESSION: ' + msg.uname);
            cookieUser = msg.uname;
            cookieUser = cookieUser.substring(0, cookieUser.indexOf(','));

            var Bits = 512;
            var cookieRSAKey = cryptico.generateRSAKey(cookieUser, Bits);
            var cookiePublicKey = cryptico.publicKeyString(cookieRSAKey);

            socket.emit('response', {'user': cookieUser, 'public': cookiePublicKey});

            socket.on("info", function (result) {
                keys = result.data;

                socket.emit('id', {'name': cookieUser});
                socket.on('name', function (data) {
                    var myid = data.id[0].id;

                    var postField = null;
                    if(document.getElementsByClassName('uiTextareaAutogrow input autofocus _34z- mentionsTextarea textInput').length !== 0) {
                        var postField = document.getElementsByClassName('uiTextareaAutogrow input autofocus _34z- mentionsTextarea textInput');
                        var postButton = document.getElementsByClassName('_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy');
                        postButton[0].addEventListener("mouseenter", function (event) {
                            //postField[0].value = "Hello World";
                            //console.log(postField[0].value);
                            var postFieldText = postField[0];
                            var postFieldTextInnerText = postFieldText.value;
                            var header = postFieldTextInnerText.substring(0,3);
                            if(header !== 'SNP') {
                                var EncryptedMessage = cryptico.encrypt(postFieldTextInnerText, cookiePublicKey);
                                var messageToCompress = 'SNP' + '(' + myid + ')' + EncryptedMessage.cipher;
                                postFieldText.value = messageToCompress;
                            }
                            //$("#u_0_x").trigger(jQuery.Event('keypress'));
                        });
                        postButton[0].addEventListener("click", function(event){
                            if(!mouseClickUpdate) {
                                mouseClickUpdate = true;
                                chrome.runtime.sendMessage({type: "updatef"});
                            }
                        });
                    }
                    else {

                        //$('#js_k').on('click', function(){
                        //   console.log("HIT TEXTBOX!\n");
                        //});
                        if($("._4h96").length !== 0){
                            $("._4h96").on('click', function(){
                                console.log("CLICKED ONE\n");
                            });
                            $("._4h96").on('mouseenter', function(){
                                console.log("MOUSEENTER ONE\n");
                                setTimeout(function(){
                                    var insideTextField = document.getElementsByClassName("_1mwp  " + "_5yk1");
                                    insideTextField[0].addEventListener('click', function(){
                                        console.log("EUREKA");
                                        var postButton = document.getElementsByClassName('_1mf7 _4jy0 _4jy3 _4jy1 _51sy selected _42ft');
                                        postButton[0].addEventListener('mouseenter', function (event) {
                                            var postFieldText = insideTextField[0];
                                            console.log(postFieldText.innerText);
                                            var postFieldTextInnerText = postFieldText.innerText;
                                            var header = postFieldTextInnerText.substring(0, 3);
                                            if (header !== 'SNP') {
                                                var EncryptedMessage = cryptico.encrypt(postFieldTextInnerText, cookiePublicKey);
                                                var messageToCompress = 'SNP' + '(' + myid + ')' + EncryptedMessage.cipher;
                                                postFieldText.innerText = messageToCompress;
                                            }
                                            //$("#u_0_x").trigger(jQuery.Event('keypress'));
                                        });
                                        postButton[0].addEventListener("click", function (event) {
                                            if (!mouseClickUpdate) {
                                                mouseClickUpdate = true;
                                                chrome.runtime.sendMessage({type: "updatef"});
                                            }
                                        });
                                    });
                                }, 1000);
                            });

                        }
                        else{
                            var insideTextField = document.getElementsByClassName("_1mwp  "+"_5yk1");
                            insideTextField[0].addEventListener('click', function(){
                                console.log("EUREKA");
                                var postButton = document.getElementsByClassName('_1mf7 _4jy0 _4jy3 _4jy1 _51sy selected _42ft');
                                postButton[0].addEventListener('mouseenter', function (event) {
                                    var postFieldText = insideTextField[0];
                                    console.log(postFieldText.innerText);
                                    var postFieldTextInnerText = postFieldText.innerText;
                                    var header = postFieldTextInnerText.substring(0, 3);
                                    if (header !== 'SNP') {
                                        var EncryptedMessage = cryptico.encrypt(postFieldTextInnerText, cookiePublicKey);
                                        var messageToCompress = 'SNP' + '(' + myid + ')' + EncryptedMessage.cipher;
                                        postFieldText.innerText = messageToCompress;
                                    }
                                    //$("#u_0_x").trigger(jQuery.Event('keypress'));
                                });
                                postButton[0].addEventListener("click", function (event) {
                                    if (!mouseClickUpdate) {
                                        mouseClickUpdate = true;
                                        chrome.runtime.sendMessage({type: "updatef"});
                                    }
                                });
                            });
                        }

                        //var postButton = document.getElementsByClassName('_1mf7 _4jy0 _4jy3 _4jy1 _51sy selected _42ft');
                        //var postField = document.getElementsByClassName('_209g _2vxa');
                        //postButton[0].addEventListener('mouseenter', function (event) {
                        //    var postFieldText = postField[0];
                        //    console.log(postFieldText.innerText);
                        //    var postFieldTextInnerText = postFieldText.innerText;
                        //    var header = postFieldTextInnerText.substring(0, 3);
                        //    if (header !== 'SNP') {
                        //        var EncryptedMessage = cryptico.encrypt(postFieldTextInnerText, cookiePublicKey);
                        //        var messageToCompress = 'SNP' + '(' + myid + ')' + EncryptedMessage.cipher;
                        //        postFieldText.innerText = messageToCompress;
                        //    }
                        //    //$("#u_0_x").trigger(jQuery.Event('keypress'));
                        //});
                        //postButton[0].addEventListener("click", function (event) {
                        //    if (!mouseClickUpdate) {
                        //        mouseClickUpdate = true;
                        //        chrome.runtime.sendMessage({type: "updatef"});
                        //    }
                        //});
                    }

                    var stream = document.getElementsByClassName('_5pbx userContent');
                    for(var msg = 0; msg<stream.length;msg++){
                        if(stream[msg].innerText.search("SNP") !== -1){
                            console.log("Found SNP text on ", msg, stream[msg].innerText);
                            var id = stream[msg].innerText.substring(stream[msg].innerText.indexOf('(')+1, stream[msg].innerText.indexOf(')'));
                            if(keys.length === 0 && myid === parseInt(id)){
                                console.log("USER HAS NO FRIENDS\n");
                                var cipherText = stream[msg].innerText.substring(stream[msg].innerText.indexOf(')')+1, stream[msg].innerText.length);
                                var DecryptionResult = cryptico.decrypt(cipherText, cookieRSAKey);
                                stream[msg].innerText = DecryptionResult.plaintext;
                            }
                            if(myid !== undefined && myid === parseInt(id)){
                                var cipherText = stream[msg].innerText.substring(stream[msg].innerText.indexOf(')')+1, stream[msg].innerText.length);
                                var DecryptionResult = cryptico.decrypt(cipherText, cookieRSAKey);
                                stream[msg].innerText = DecryptionResult.plaintext;
                            }
                            else{
                                for(var key = 0;key<keys.length;key++){
                                    if(keys[key].fid !== undefined){
                                        if(keys[key].fid === parseInt(id)){
                                            var cipherText = stream[msg].innerText.substring(stream[msg].innerText.indexOf(')')+1, stream[msg].innerText.length);
                                            socket.emit('user', {'id': keys[key].fid});
                                            var tempmsg = msg;
                                            socket.on('rsa', function(data){
                                                var RSAKey = cryptico.generateRSAKey(data.name[0].uname, Bits);
                                                var DecryptionResult = cryptico.decrypt(cipherText, RSAKey);
                                                stream[tempmsg].innerText = DecryptionResult.plaintext;
                                            });
                                        }
                                    }
                                    else if(keys[key].fid2 !== undefined){
                                        if(keys[key].fid2 === parseInt(id)){
                                            var cipherText = stream[msg].innerText.substring(stream[msg].innerText.indexOf(')')+1, stream[msg].innerText.length);
                                            socket.emit('user', {'id': keys[key].fid2});
                                            var tempmsg = msg;
                                            socket.on('rsa', function(data){
                                                var RSAKey = cryptico.generateRSAKey(data.name[0].uname, Bits);
                                                var DecryptionResult = cryptico.decrypt(cipherText, RSAKey);
                                                stream[tempmsg].innerText = DecryptionResult.plaintext;
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