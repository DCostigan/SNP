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
    users : [],

    post : function (uname, password){
        $.ajax({
            type        : 'POST',
            url         : '/postuser',
            data        : {'uname' : uname, 'password' : password},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
        });
    },

    check : function (uname, password) {
        var that = this;
        $.ajax({
            type        : 'POST',
            url         : '/checkuser',
            data        : {last : that.users.length },
            dataType    : 'json'
        }).done(function (data) {
            console.log('Check the rcvd username: ' + JSON.stringify(data));
        });
    }
};


document.addEventListener('DOMContentLoaded', function () {
    console.log("Entered DOMContentLoaded\n");
    var username = $('#user-name');
    var password = $('#password');
    var login = $('#login');

    var userc = new UserClient({
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
        userc.check(injectionProofUsername, injectionProofPassword);
        return false;
    });
});
