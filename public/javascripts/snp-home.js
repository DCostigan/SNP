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

    check : function (uname) {
        var that = this;
        $.ajax({
            type: 'POST',
            url: '/home/checkuser',
            data: {'uname': uname},
            dataType: 'json'
        }).done(function (data) {
            console.log('Valid User: ' + data.status);
            if (data.status === 'OK') {
                var li = $('<li>');
                li.html("<label><input type=&#34;text&#34; value=&#34;uname&#34; class=&#34;form-control&#34; readonly></label><input type=&#34;image&#34; class=&#34;delete-button&#34; src=&#34;/images/delete.png&#34; alt=&#34;Delete&#34;>");
                that.view.append(li);
            }
            else {
                alert("Invalid Username and/or Password");
            }
        });
    },

        remove : function (uname) {
            var that = this;
            $.ajax({
                type        : 'POST',
                url         : '/home/removefriend',
                data        : {'uname' : uname},
                dataType    : 'json'
            }).done(function (data) {
                console.log('Valid User: ' + data.status);
                if(data.status === 'OK') {

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
    var invitationList = $('#invitation-list');

    var homec = new HomeClient({
        view : username,
        view2:  friendsList,
        view3:  invitationList
    });

    var addButton = new PostButton({
        view    : addUser,
        input   : username
    });

    $("ul").on("click", "input.trash-button", function(e){
        e.preventDefault();
        //var uname = this;
        //console.log(uname);
        //homec.remove(uname);
        $(this).parent().remove();
    });

    //$("ul").on("click", "input.accept-button", function(e){
    //    e.preventDefault();
    //    homec.accept(this);
    //    $(this).parent().remove();
    //});
    //
    $("ul").on("click", "input.delete-button", function(e){
        e.preventDefault();
        //homec.reject(this);
        $(this).parent().remove();
    });

    addButton.createListener('click', function(event){
        console.log(this);
        console.log("Hit addButton!\n");
        var text = this.input.val();
        var injectionProofUsername = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        homec.check(injectionProofUsername);
        return false;
    });
});