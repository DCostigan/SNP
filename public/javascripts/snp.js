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

    check : function (keyPair) {
        var that = this;
        $.ajax({
            type        : 'POST',
            url         : '/checkuser',
            data        : {last : that.keyPairs.length },
            dataType    : 'json'
        }).done(function (data) {
            console.log('Check the rcvd key pairs: ' + JSON.stringify(data));

            //that.keyPairs = that.keyPairs.concat(data);
            //
            //that.view.empty();
            //for(var i=0; i< that.keyPairs.length; i++){
            //
            //}
        });
    }
};