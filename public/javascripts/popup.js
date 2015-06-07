var list;

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

function generatePublicKey(){
    return "Pending...";
}

function renderPublic(publicText) {
    var public = document.getElementById('public');
    public.textContent = publicText + generatePublicKey();
    public.style.width = "300px";
}

function renderTextField(){
    var text = document.getElementById('add-text');
    text.style.color = "gray";
    text.style.boxSizing.length = "200px";
}

function renderButton(){
    var button = document.getElementById('add-button');
    button.style.alignContent = "center";
    button.style.boxSizing.length = "50px";
    button.style.boxSizing.height = "25px";
}

function renderList(){
    list.check(keyPair);
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

var populateList = function (){
  list = createListClient();
};

var buttonCreation = function() {

    var addText = $('#add-text');
    var addButton = $('#add-button');

    var addButtonEvent = new PostButton({
        view    : addButton,
        input   : addText
    });

    addButtonEvent.bind('click', function(event){
        console.log(this);
        var text = this.input.val();
        var injectionProofText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        list.post(generatePublicKey(), injectionProofText);
        $('#list-public').append('<li>injectionProofText</li>');
        this.input.val('');
        return false;
    });
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('HelloApp!' + '\n');
    renderHeader();
    renderPublic('Your Public Key: ');
    renderTextField();
    renderButton();

    loadScript("/public/javascripts/snp.js", populateList);
    renderList();
    loadScript("/public/javascripts/snp.js", buttonCreation);



}, function(errorMessage) {
      renderStatus('Cannot display settings. ' + errorMessage);
});