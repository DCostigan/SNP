//var list;
////var buttonTypes;
//function PostButton(config){
//    for (var prop in config){
//        if(config.hasOwnProperty(prop)){
//            this[prop] = config[prop];
//        }
//    }
//}
//
//PostButton.prototype = {
//    createListener : function (type, cb) {
//        var that = this;
//        console.log(this.view);
//        this.view.on(type, function (event) {
//            cb.call(that, event);
//        });
//    }
//};
//
//function ServerClient(config){
//    for(var prop in config) {
//        if(config.hasOwnProperty(prop)){
//            this[prop] = config[prop];
//        }
//    }
//}
//
//ServerClient.prototype = {
//    keyPairs : [],
//
//    post : function (userPublic, destPublic){
//        $.ajax({
//            type        : 'POST',
//            url         : '/postkeys',
//            data        : {'userPublic' : userPublic, 'destPublic' : destPublic},
//            dataType    : 'json'
//        }).done(function (data) {
//            console.log('Post status: ' + data.status);
//        });
//    },
//
//    check : function (keyPair) {
//        var that = this;
//        $.ajax({
//            type        : 'POST',
//            url         : '/checkkeys',
//            data        : {last : that.keyPairs.length },
//            dataType    : 'json'
//        }).done(function (data) {
//            console.log('Check the rcvd key pairs: ' + JSON.stringify(data));
//
//            //that.keyPairs = that.keyPairs.concat(data);
//            //
//            //that.view.empty();
//            //for(var i=0; i< that.keyPairs.length; i++){
//            //
//            //}
//        });
//    }
//};
//
//function renderHeader(){
//    var header = document.getElementById('header');
//    var logo = document.createElement('img');
//    //logo.src = 'public/images/icon4.png';
//    logo.setAttribute("src", "/public/images/icon4.png");
//    logo.setAttribute("height", "64");
//    logo.setAttribute("width", "64");
//    logo.setAttribute("alt", "Logo");
//    var h2 = document.createElement('h2');
//    var text = document.createTextNode('Social Network Privacy');
//    h2.appendChild(text);
//    header.appendChild(logo);
//    header.appendChild(h2);
//}
//
//function generatePublicKey(){
//    return "Pending...";
//}
//
//function renderPublic(publicText) {
//    var public = document.getElementById('public');
//    public.textContent = publicText + generatePublicKey();
//    public.style.width = "300px";
//}
//
//function renderTextField(){
//    var text = document.getElementById('add-text');
//    text.style.color = "gray";
//    text.style.boxSizing.length = "200px";
//}
//
////function createButtonTypes(cb){
////    buttonTypes = {
////        ADD : document.getElementById('add-button')
////    }
////}
//
//function renderButton(){
//    console.log("Hit renderButton\n");
//    var button = document.getElementById('add-button');
//    button.style.alignContent = "center";
//    button.style.boxSizing.length = "50px";
//    button.style.boxSizing.height = "25px";
//    initButton();
//}
//
//function renderList(){
//    if(list !== 'undefined'){
//        console.log('Rendered List\n');
//        //list.check(keyPair);
//    }
//    else{
//        console.log('list undefined\n');
//    }
//}
//
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
//function initButton() {
//    console.log("Hit initButton\n");
//    var addText = document.getElementById('add-text');
//    var addButton = document.getElementById('add-button');
//    //var buttonType = buttonTypes.ADD;
//    //console.log(addButton + '\n');
//    //console.log(buttonType + '\n');
//    //if(addButton == buttonType) {
//    //    console.log("YES\n");
//    //}
//
//    var addButtonEvent = new PostButton({
//        view    : addButton,
//        input   : addText
//    });
//
//    //addButton.addEventListener('click', function(){
//    //    console.log(this);
//    //    var text = this.input.val();
//    //    var injectionProofText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
//    //    list.post(generatePublicKey(), injectionProofText);
//    //    document.getElementById('list-public').append('<li>injectionProofText</li>');
//    //    this.input.val('');
//    //    return false;
//    //});
//
//    addButtonEvent.createListener('click', function(event){
//        console.log(this);
//        var text = this.input.val();
//        var injectionProofText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
//        list.post(generatePublicKey(), injectionProofText);
//        document.getElementById('list-public').append('<li>injectionProofText</li>');
//        this.input.val('');
//        return false;
//    });
//};
//
//var populateList = function (){
//    var listpublic = document.getElementById('list-public');
//    list = new ServerClient({
//        view     : listpublic
//    });
//};
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

function setPause (){
    console.log("Pressed Pause\n");
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
    //renderHeader();
    openSettings();
});

