console.log("FACEBOOK CONTENT SCRIPT\n");
var postField = document.getElementsByClassName('uiTextareaAutogrow input autofocus _34z- mentionsTextarea textInput');
var text = document.createTextNode('Hello World');
//postField[0].appendChild(text);
console.log(postField[0].value);

var postButton = document.getElementsByClassName('_42ft _4jy0 _11b _4jy3 _4jy1 selected _51sy');
console.log(postButton.length);
console.log(postButton[0]);

postButton[0].addEventListener("mouseover", function(event){
   console.log("Hit Button Post\n");
    if(postField[0].value !== "")
        postField[0].value = "Jumbled Text";
});
//
//chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
//    console.log("GOT TO onMESSAGE Listener");
//   if(msg.text && (msg.text == "report_back")){
//       sendResponse(document.all[0].outerHTML);
//   }
//});