/**
 * Created by Derek on 6/6/2015.
 */

function PostButton(config){
    for (var prop in config){
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

PostButton.prototype = {
    bind : function (type, cb) {
        var that = this;
        this.view.bind(type, function (event) {
            cb.call(that, event);
        });
    }
};

function ServerClient(config){
    for(var prop in config) {
        if(config.hasOwnProperty(prop)){
            this[prop] = config[prop];
        }
    }
}

ServerClient.prototype = {
    keyPairs : [],

    post : function (userPublic, destPublic){
        $.ajax({
            type        : 'POST',
            url         : '/postkeys',
            data        : {'userPublic' : userPublic, 'destPublic' : destPublic},
            dataType    : 'json'
        }).done(function (data) {
            console.log('Post status: ' + data.status);
        });
    },

    check : function (keyPair) {
        var that = this;
        $.ajax({
            type        : 'POST',
            url         : '/checkkeys',
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

var list = new ServerClient({
    view     : $('ul#list-public')
});

function createListClient(){
    return list;
}

