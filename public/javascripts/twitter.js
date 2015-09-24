console.log("TWITTER CONTENT SCRIPT\n");

var postButton = document.getElementsByClassName("btn primary-btn tweet-action tweet-btn js-tweet-btn");
console.log(postButton[0]);

postButton[0].addEventListener("mouseover", function(event){
    console.log("Hit Event Listener");
    var postField = document.getElementById("tweet-box-home-timeline");
    var postFieldText = postField.childNodes[0];
    console.log(postFieldText);
   postFieldText.innerText = "jumbled text";
});