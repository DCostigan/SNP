console.log("TWITTER CONTENT SCRIPT\n");

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
