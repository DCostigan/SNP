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

function HomeClient(config){
    for(var prop in config) {
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

HomeClient.prototype = {

    check : function (uname, password) {
        var that = this;
        $.ajax({
            type        : 'POST',
            url         : '/checkuser',
            data        : {'uname' : uname, 'password' : password},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Valid User: ' + data.status);
            if(data.status === 'OK') {
                window.location.assign("http://localhost:3000/home");
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
    var addUser = $('#add-user');
    var friendsList = $('#friends-list');
    var invitationList = $('#invitation-list')

    var homec = new HomeClient({
        view : username,
        view2:  friendsList,
        view3:  invitationList
    });

    var addButton = new PostButton({
        view    : addUser,
        input   : username
    });

    loginButton.createListener('click', function(event){
        console.log(this);
        var text = this.input.val();
        var injectionProofUsername = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //$('#event-name').prop('readonly', true);
        var text2 = this.input2.val();
        var injectionProofPassword = text2.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        indexc.check(injectionProofUsername, injectionProofPassword);
        return false;
    });
});