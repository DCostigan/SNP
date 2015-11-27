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

function readCookie(name) {
    var cookies = document.cookie.split(';'),
        length = cookies.length,
        i,
        cookie,
        nameEQ = name + '=';
    for (i = 0; i < length; i += 1) {
        cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
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

function eraseCookie(name) {
    createCookie(name, '', -1);
}

function openIndex(){
    window.location.assign("https://localhost:3030");
}

HomeClient.prototype = {

    friends : [],
    invitations : [],

    poll : function (uname, session, friendsList, invitationList) {
        var that = this;
        $.ajax({
            type: 'POST',
            url: '/home/postupdates',
            data: { 'uname' : uname, 'session': session, lastFriend: that.friends.length, lastInvitation: that.invitations.length},
            dataType: 'json'
        }).done(function (data) {
            if(data.status === 'INVALID'){
                openIndex();
                var url = 'http://localhost:3000';
                //needs to delete session from db
                eraseCookie(url);
                return;
            }
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

    check : function (cookiename, uname) {
        var that = this;
        $.ajax({
            type: 'POST',
            url: '/home/checkuser',
            data: {'cookiename': cookiename, 'uname': uname},
            dataType: 'json'
        }).done(function (data) {
            console.log('Valid User: ' + data.status);
            if (data.status === 'OK') {
                var li = document.createElement("li");
                var label = document.createElement("label");
                var input = document.createElement("input");
                var button = document.createElement("input");
                button.setAttribute('type', 'image');
                button.setAttribute('class', 'delete-button');
                button.setAttribute('src', '/images/delete.png');
                button.setAttribute('alt', 'Delete');
                input.setAttribute('type', 'text');
                input.setAttribute('value', uname);
                input.setAttribute('class', 'form-control');
                input.readOnly = true;
                label.appendChild(input);
                li.appendChild(label);
                li.appendChild(button);
                that.view3.append(li);
            }
            else {
                alert("Invalid Username");
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
                if(data.status === 'OK') {
                    console.log('Removed Friend ' + fname + ": "  + data.status);
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
            if(data.status === 'OK') {
                console.log('Added Friend ' + iname + ": "  + data.status);
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
            data        : {'uname' : uname, 'iname' : iname},
            dataType    : 'json'
        }).done(function (data) {
            if(data.status === 'OK') {
                console.log('Rejected Invite ' + iname + ": "  + data.status);
            }
            else{
                alert("Could not Reject Invite!\n");
            }
        });
    },

    clear : function (uname) {
        var that = this;
        $.ajax({
            type        : 'POST',
            url         : '/home/clear',
            data        : {'uname' : uname},
            dataType    : 'json'
        }).done(function (data) {
            if(data.status === 'OK') {
                console.log('Cleared User Session for ' + uname);
            }
            else{
                alert("Could not Clear Session!\n");
            }
        });
    }
};

var previousUser = '';

document.addEventListener('DOMContentLoaded', function () {
    console.log("Entered DOMContentLoaded\n");
    var url = "http://localhost:3000";
    var cookie = readCookie(url);
    if(cookie === null){
        openIndex();
        return;
    }
    var cookieUser = cookie.substring(0, cookie.indexOf(','));
    var cookieSession = cookie.substring(cookie.indexOf(',')+1, cookie.length);
    previousUser = cookieUser;

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
    homec.poll(cookieUser, cookieSession, friendsList, invitationList);

    $("ul").on("click", "a.logout", function(e){
        var url = 'http://localhost:3000';
        var cookie = readCookie(url);
        var cookieUser = cookie.substring(0, cookie.indexOf(','));
        if(cookie === null || cookieUser !== previousUser){
            openIndex();
            return;
        }
        //needs to delete session from db
        homec.clear(cookieUser);
        eraseCookie(url);
    });

    $("ul").on("click", "input.trash-button", function(e){
        e.preventDefault();
        var cookie = readCookie(url);
        var cookieUser = cookie.substring(0, cookie.indexOf(','));
        if(cookie === null || cookieUser !== previousUser){
            openIndex();
            return;
        }
        var that = $(this).parent().find('label').find('input').val();
        homec.remove(cookieUser, that);
        $(this).parent().remove();
    });

    $("ul").on("click", "input.accept-button", function(e){
        e.preventDefault();
        var cookie = readCookie(url);
        var cookieUser = cookie.substring(0, cookie.indexOf(','));
        if(cookie === null || cookieUser !== previousUser){
            openIndex();
            return;
        }
        var that = $(this).parent().find('label').find('input').val();
        homec.accept(cookieUser, that);
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
        var cookie = readCookie(url);
        var cookieUser = cookie.substring(0, cookie.indexOf(','));
        if(cookie === null || cookieUser !== previousUser){
            openIndex();
            return;
        }
        var that = $(this).parent().find('label').find('input').val();
        homec.reject(cookieUser, that);
        $(this).parent().remove();
    });

    addButton.createListener('click', function(event){
        event.preventDefault();
        var cookie = readCookie(url);
        var cookieUser = cookie.substring(0, cookie.indexOf(','));
        if(cookie === null || cookieUser !== previousUser){
            openIndex();
            return;
        }
        var text = this.input.val();
        for(var i = 0; i< invitationList[0].childElementCount;i++){
            if(invitationList[0].childNodes[i].innerHTML.indexOf(text) != -1){
                console.log("Already have a pending invitation for that user!\n");
                document.getElementById("user-name").value = '';
                return false;
            }
        }
        console.log("AddButton Text: " + text + "\n");
        document.getElementById("user-name").value = '';
        var injectionProofUsername = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if(injectionProofUsername === '' || injectionProofUsername === cookieUser)
            return false;
        homec.check(cookieUser, injectionProofUsername);
        return false;
    });
});