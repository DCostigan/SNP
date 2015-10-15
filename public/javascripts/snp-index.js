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

function IndexClient(config){
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

IndexClient.prototype = {
    check : function (uname, password) {
        var that = this;
        var securityKey = getRandomInt(12345723691085,9245788002198778345);
        $.ajax({
            type        : 'POST',
            url         : '/checkuser',
            data        : {'uname' : uname, 'password' : password, 'securityKey': securityKey},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Valid User: ' + data.status);
            if(data.status === 'OK') {
                var url = 'http://localhost:3000';
                createCookie(url, uname, 1, securityKey, openHome());
            }
            else{
                alert("Invalid Username and/or Password");
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("Entered DOMContentLoaded\n");
    var username = $('#user-name');
    var password = $('#password');
    var login = $('#login');

    var indexc = new IndexClient({
        view : username,
        view2:  password
    });

    var loginButton = new PostButton({
        view    : login,
        input   : username,
        input2  : password
    });

    loginButton.createListener('click', function(event){
       console.log(this);
        var text = this.input.val();
        var injectionProofUsername = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //$('#event-name').prop('readonly', true);
        var text2 = this.input2.val();
        var injectionProofPassword = text2.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if(injectionProofUsername === '' || injectionProofPassword === ''){
            alert("Invalid Username And/Or Password!\n");
            return false;
        }
        indexc.check(injectionProofUsername, injectionProofPassword);
        return false;
    });
});