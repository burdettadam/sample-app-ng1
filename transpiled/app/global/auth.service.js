"use strict";
/**
 * This service emulates an Authentication Service.
 */
var AuthService = (function () {
    function AuthService(AppConfig, $q, $timeout) {
        /**
         * Returns true if the user is currently authenticated, else false
         */
        this.isAuthenticated = function () {
            var authd = this.AppConfig.defaultECI != "none";
            if (authd) {
                console.log("Authenicated session");
            }
            else {
                console.log("No authenicated session");
            }
            return (authd);
            //   return !!this.AppConfig.emailAddress;
        };
        this.manifoldSaveSession = function (token_json) {
            var Session_ECI = token_json.OAUTH_ECI;
            var access_token = token_json.access_token;
            console.log("Saving session for ", Session_ECI);
            this.AppConfig.defaultECI = Session_ECI;
            this.AppConfig.access_token = access_token;
            //this.AppConfig.client_state = undefined;
            //kookie_create(Session_ECI);
            this.AppConfig.save();
        };
        this.retrieveOAuthCode = function () {
            //var code = this.getQueryVariable("code");
            var code = this.getParameterByName("code");
            return (code) ? code : "NO_OAUTH_CODE";
        };
        this.getOAuthAccessToken = function (code, callback, error_func, $http) {
            var returned_state = parseInt(this.getParameterByName("state"));
            //var returned_state = parseInt(this.getQueryVariable("state"));
            var expected_state = parseInt(this.AppConfig.client_state);
            //var expected_state = parseInt(window.localStorage.getItem("manifold_CLIENT_STATE"));// is using window localStorage ok in angular?????
            if (returned_state !== expected_state) {
                console.warn("OAuth Security Warning. Client states do not match. (Expected %d but got %d)", expected_state, returned_state);
            }
            console.log("getting access token with code: ", code);
            if (typeof (callback) !== 'function') {
                callback = function () { };
            }
            var url = 'https://' + this.AppConfig.login_server + '/oauth/access_token';
            var data = {
                "grant_type": "authorization_code",
                "redirect_uri": this.AppConfig.callbackURL,
                "client_id": this.AppConfig.clientKey,
                "code": code
            };
            var config = {};
            return $http.post(url, data, 'Access-Control-Allow-Origin')
                .then(function (json) {
                console.log("Recieved following authorization object from access token request: ", json);
                if (!json.OAUTH_ECI) {
                    console.error("Received invalid OAUTH_ECI. Not saving session.");
                    callback(json);
                    return;
                }
                ;
                //wrangler.saveSession(json);
                this.manifoldSaveSession(json);
                //    window.localStorage.removeItem("manifold_CLIENT_STATE");// moved into saveSession
                callback(json);
            }, // success callback
            function (json) {
                console.log("Failed to retrieve access token " + json);
                error_func = error_func || function () { };
                error_func(json);
            } // failure callback
             // failure callback
            );
            /* return $.ajax({
                 type: 'POST',
                 url: url,
                 data: data,
                 dataType: 'json',
                 success: function(json)
                 {
                     console.log("Recieved following authorization object from access token request: ", json);
                     if (!json.OAUTH_ECI) {
                         console.error("Received invalid OAUTH_ECI. Not saving session.");
                         callback(json);
                         return;
                     };
                     //wrangler.saveSession(json);
                     this.manifoldSaveSession(json);
                     window.localStorage.removeItem("manifold_CLIENT_STATE");
                     callback(json);
                 },
                 error: function(json)
                 {
                     console.log("Failed to retrieve access token " + json);
                     error_func = error_func || function(){};
                     error_func(json);
                 }
             });*/
        };
        this.AppConfig = AppConfig;
        this.$q = $q;
        this.$timeout = $timeout;
        this.usernames = ['myself@angular.dev', 'devgal@angular.dev', 'devguy@angular.dev'];
    }
    /**
     * Fake authentication function that returns a promise that is either resolved or rejected.
     *
     * Given a username and password, checks that the username matches one of the known
     * usernames (this.usernames), and that the password matches 'password'.
     *
     * Delays 800ms to simulate an async REST API delay.
     */
    AuthService.prototype.authenticate = function (username, password) {
        var _this = this;
        var _a = this, $timeout = _a.$timeout, $q = _a.$q, AppConfig = _a.AppConfig;
        // checks if the username is one of the known usernames, and the password is 'password'
        var checkCredentials = function () { return $q(function (resolve, reject) {
            var validUsername = _this.usernames.indexOf(username) !== -1;
            var validPassword = password === 'password';
            return (validUsername && validPassword) ? resolve(username) : reject("Invalid username or password");
        }); };
        return $timeout(checkCredentials, 800)
            .then(function (authenticatedUser) {
            AppConfig.emailAddress = authenticatedUser;
            AppConfig.save();
        });
    };
    /** Logs the current user out */
    AuthService.prototype.logout = function () {
        this.AppConfig.defaultECI = "none";
        this.AppConfig.emailAddress = undefined;
        this.AppConfig.save();
    };
    AuthService.prototype.getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        console.log(query);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        console.log('Query variable %s not found', variable);
        return false;
    };
    ;
    //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    AuthService.prototype.getParameterByName = function (name, url) {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    ;
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map