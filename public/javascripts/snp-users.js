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

UserClient.prototype = {

    post : function (uname, password){
        $.ajax({
            type        : 'POST',
            url         : '/users/postuser',
            data        : {'uname' : uname, 'password' : password},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
            window.location.assign("http://localhost:3000/home");
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
