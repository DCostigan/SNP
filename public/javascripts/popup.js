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
    $.getScript("snp.js", function(){

        buttonAction();

    });
}

function renderList(){

}




document.addEventListener('DOMContentLoaded', function() {
    renderHeader();
    renderPublic('Your Public Key: ');
    renderTextField();
    renderButton();
    renderList();

    }, function(errorMessage) {
      renderStatus('Cannot display settings. ' + errorMessage);
});
