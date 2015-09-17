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

function createCookie(name, value, days, cb) {
    var expires = '',
        date = new Date();
    if (days) {
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

function openHome(){
    //SHOULD CLOSE ALL OPEN HOMES
    window.location.assign("http://localhost:3000/home");
}

UserClient.prototype = {

    post : function (uname, password){
        $.ajax({
            type        : 'POST',
            url         : '/users/postuser',
            data        : {'uname' : uname, 'password' : password},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
            var url = 'http://localhost:3000';
            createCookie(url, uname, 1, openHome());
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
        userc.post(injectionProofUsername, injectionProofPassword);
        return false;
    });
});
