/**
 * Created by Derek on 11/28/2015.
 */

function openHome(){
    //SHOULD CLOSE ALL OPEN HOMES
    window.location.assign("https://localhost:3030/home");
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Entered DOMContentLoaded\n");

    var button = document.getElementById('return');
    button.addEventListener('click', function(){
        openHome();
    });
});