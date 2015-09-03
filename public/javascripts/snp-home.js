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

    friends : [],
    invitations : [],

    poll : function (uname, friendsList, invitationList) {
        var that = this;
        $.ajax({
            type: 'POST',
            url: '/home/postupdates',
            data: { 'uname' : uname, lastFriend: that.friends.length, lastInvitation: that.invitations.length},
            dataType: 'json'
        }).done(function (data) {
            console.log('Check rcvd friends & invitations: ' + JSON.stringify(data));

            var fullJSONarray = data;
            for(var i =0; i< fullJSONarray.length;i++){
                if(fullJSONarray[i].fname !== undefined)
                    that.friends = that.friends.concat(fullJSONarray[i]);
                else if(fullJSONarray[i].iname !== undefined)
                    that.invitations = that.invitations.concat(fullJSONarray[i]);
                else
                    console.log("Could not place fullJSONarray: " + i + "\n");
            }

            that.view2.empty();
            that.view3.empty();


            for(var i=0;i<that.friends.length;i++){
                var li = document.createElement("li");
                var label = document.createElement("label");
                var input = document.createElement("input");
                var button = document.createElement("input");
                button.setAttribute('type', 'image');
                button.setAttribute('class', 'trash-button');
                button.setAttribute('src', '/images/trash.jpg');
                button.setAttribute('alt', 'Remove');
                input.setAttribute('type', 'text');
                input.setAttribute('value', that.friends[i].fname);
                input.setAttribute('class', 'form-control');
                input.readOnly = true;
                label.appendChild(input);
                li.appendChild(label);
                li.appendChild(button);
                that.view2.append(li);
            }

            for(var i=0;i<that.invitations.length;i++){
                if(that.invitations[i].type === "sent"){
                    var li = document.createElement("li");
                    var label = document.createElement("label");
                    var input = document.createElement("input");
                    var button = document.createElement("input");
                    button.setAttribute('type', 'image');
                    button.setAttribute('class', 'delete-button');
                    button.setAttribute('src', '/images/delete.png');
                    button.setAttribute('alt', 'Delete');
                    input.setAttribute('type', 'text');
                    input.setAttribute('value', that.invitations[i].iname);
                    input.setAttribute('class', 'form-control');
                    input.readOnly = true;
                    label.appendChild(input);
                    li.appendChild(label);
                    li.appendChild(button);
                    that.view3.append(li);
                }
                else if(that.invitations[i].type === "received"){
                    var li = document.createElement("li");
                    var label = document.createElement("label");
                    var input = document.createElement("input");
                    var deleteButton = document.createElement("input");
                    var acceptButton = document.createElement("input");
                    deleteButton.setAttribute('type', 'image');
                    deleteButton.setAttribute('class', 'delete-button');
                    deleteButton.setAttribute('src', '/images/delete.png');
                    deleteButton.setAttribute('alt', 'Delete');
                    acceptButton.setAttribute('type', 'image');
                    acceptButton.setAttribute('class', 'accept-button');
                    acceptButton.setAttribute('src', '/images/accept.png');
                    acceptButton.setAttribute('alt', 'Accept');
                    input.setAttribute('type', 'text');
                    input.setAttribute('value', that.invitations[i].iname);
                    input.setAttribute('class', 'form-control');
                    input.readOnly = true;
                    label.appendChild(input);
                    li.appendChild(label);
                    li.appendChild(deleteButton);
                    li.appendChild(acceptButton);
                    that.view3.append(li);
                }
                else{
                    console.log("ERROR: Unrecognized type for invitation\n");
                }
            }
        });
    },

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
                //COMMENTED BECAUSE THE PAGE REFRESHES SO THIS MANIPULATION WILL NOT SHOW
                //var li = $('<li>');
                //li.html("<label><input type=&#34;text&#34; value=&#34;uname&#34; class=&#34;form-control&#34; readonly></label><input type=&#34;image&#34; class=&#34;delete-button&#34; src=&#34;/images/delete.png&#34; alt=&#34;Delete&#34;>");
                //that.view.append(li);
            }
            else {
                alert("Invalid Username and/or Password");
            }
        });
    },

        remove : function (uname, fname) {
            var that = this;
            $.ajax({
                type        : 'POST',
                url         : '/home/removefriend',
                data        : {'uname' : uname, 'fname' : fname},
                dataType    : 'json'
            }).done(function (data) {
                console.log('Removed Friend ' + fname + ": "  + data.status);
                if(data.status === 'OK') {

                }
                else{
                    alert("Could not Remove Friend!\n");
                }
            });
    },

    accept : function (uname, iname) {
        var that = this;
        $.ajax({
            type        : 'POST',
            url         : '/home/addfriend',
            data        : {'uname' : uname, 'iname' : iname},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Added Friend ' + iname + ": "  + data.status);
            if(data.status === 'OK') {

            }
            else{
                alert("Could not Accept Invite!\n");
            }
        });
    },

    reject : function (uname, iname) {
        var that = this;
        $.ajax({
            type        : 'POST',
            url         : '/home/deleteinvite',
            data        : {'uname' : uname, 'fname' : iname},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Rejected Invite ' + iname + ": "  + data.status);
            if(data.status === 'OK') {

            }
            else{
                alert("Could not Reject Invite!\n");
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

    //CHANGE UNAME TO COOKIE STORED USER
    homec.poll("dcostigan@umass.edu", friendsList, invitationList);

    $("ul").on("click", "input.trash-button", function(e){
        e.preventDefault();
        var that = $(this).parent().find('label').find('input').val();
        homec.remove("dcostigan@umass.edu", that);
        $(this).parent().remove();
    });

    $("ul").on("click", "input.accept-button", function(e){
        e.preventDefault();
        var that = $(this).parent().find('label').find('input').val();
        homec.accept("dcostigan@umass.edu", that);
        var friendsList = document.getElementById('friends-list');
        var li = document.createElement("li");
        var label = document.createElement("label");
        var input = document.createElement("input");
        var button = document.createElement("input");
        button.setAttribute('type', 'image');
        button.setAttribute('class', 'trash-button');
        button.setAttribute('src', '/images/trash.jpg');
        button.setAttribute('alt', 'Remove');
        input.setAttribute('type', 'text');
        input.setAttribute('value', that);
        input.setAttribute('class', 'form-control');
        input.readOnly = true;
        label.appendChild(input);
        li.appendChild(label);
        li.appendChild(button);
        friendsList.appendChild(li);
        $(this).parent().remove();
    });

    $("ul").on("click", "input.delete-button", function(e){
        e.preventDefault();
        var that = $(this).parent().find('label').find('input').val();
        homec.reject("dcostigan@umass.edu", that);
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