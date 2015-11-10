function PostButton(config){
    for (var prop in config){
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

PostButton.prototype = {
    createListener : function (type, cb) {
        var that = this;
        console.log(this.view);
        this.view.on(type, function (event) {
            cb.call(that, event);
        });
    }
};

function UserClient(config){
    for(var prop in config) {
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createCookie(name, value, days, securityKey, cb) {
    var expires = '',
        date = new Date();
    if (days) {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + value +','+ securityKey + expires + '; path=/';
}

function openHome(){
    //SHOULD CLOSE ALL OPEN HOMES
    window.location.assign("https://localhost:3030/home");
}

UserClient.prototype = {

    post : function (uname, password){
        var securityKey = getRandomInt(12345723691085,9245788002198778345);
        $.ajax({
            type        : 'POST',
            url         : '/users/postuser',
            data        : {'uname' : uname, 'password' : password, 'securityKey': securityKey},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
            if(data.status === 'OK') {
                var url = 'http://localhost:3000';
                createCookie(url, uname, 1, securityKey, openHome());
            }
            else{
                alert("User Is Already Taken!");
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("Entered DOMContentLoaded\n");
    var username = $('#user-name');
    var newPassword = $('#new-password');
    var confPassword = $('#confirm-password');
    var create = $('#create');

    var userc = new UserClient({
        view : username,
        view2:  newPassword,
        view3:  confPassword
    });

    var createButton = new PostButton({
        view    : create,
        input   : username,
        input2  : newPassword,
        input3  : confPassword
    });

    createButton.createListener('click', function(event){
        console.log(this);
        var text = this.input.val();
        var injectionProofUsername = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var text2 = this.input2.val();
        var text3 = this.input3.val();

        if(text2 !== text3){
            alert("Passwords do not match!\n");
            return false;
        }
        var injectionProofPassword = text2.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if(injectionProofUsername === '' || injectionProofPassword === ''){
            alert("Invalid Username And/Or Password!\n");
            return false;
        }
        userc.post(injectionProofUsername, injectionProofPassword);
        return false;
    });

    var confPassEnter = document.getElementById("confirm-password");

    confPassEnter.addEventListener('keypress', function(event){
        var key = event.which || event.keyCode;
        if(key === 13){
            var text = username.val();
            var injectionProofUsername = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var text2 = newPassword.val();
            var text3 = confPassword.val();

            if(text2 !== text3){
                alert("Passwords do not match!\n");
                return false;
            }
            var injectionProofPassword = text2.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if(injectionProofUsername === '' || injectionProofPassword === ''){
                alert("Invalid Username And/Or Password!\n");
                return false;
            }
            userc.post(injectionProofUsername, injectionProofPassword);
            return false;
        }
    });
});
