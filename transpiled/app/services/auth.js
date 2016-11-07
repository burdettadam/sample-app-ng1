"use strict";
var manifold_module_1 = require("../bootstrap/ngmodule");
/**
 *  Authentication Service.
 */
var AuthService = (function () {
    
    function AuthService(AppConfig, $q, $timeout) {
        this.AppConfig = AppConfig;
        this.$q = $q;
        this.$timeout = $timeout;
        this.usernames = ['myself@angular.dev', 'devgal@angular.dev', 'devguy@angular.dev'];
    }
    /**
     * Returns true if the user is currently authenticated, else false
     *             // authenticatedSession()
     */
    AuthService.prototype.isAuthenticated = function()
    {
        var authd = authConfig.defaultECI != "none";
        if (authd) {
            console.log("Authenicated session");
        } else {
            console.log("No authenicated session");
        }
        return (authd);
    };
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
        this.AppConfig.emailAddress = undefined;
        this.AppConfig.save();
    };
    return AuthService;
}());
manifold_module_1.ngmodule.service("AuthService", AuthService);



var ngmodule_1 = require("../bootstrap/ngmodule");
/**
 * This service emulates an Authentication Service.
 */
var FakeAuthService = (function () {
    function FakeAuthService(AppConfig, $q, $timeout) {
        this.AppConfig = AppConfig;
        this.$q = $q;
        this.$timeout = $timeout;
        this.usernames = ['myself@angular.dev', 'devgal@angular.dev', 'devguy@angular.dev'];
    }
    /**
     * Returns true if the user is currently authenticated, else false
     */
    FakeAuthService.prototype.isAuthenticated = function () {
        return !!this.AppConfig.emailAddress;
    };
    /**
     * Fake authentication function that returns a promise that is either resolved or rejected.
     *
     * Given a username and password, checks that the username matches one of the known
     * usernames (this.usernames), and that the password matches 'password'.
     *
     * Delays 800ms to simulate an async REST API delay.
     */
    FakeAuthService.prototype.authenticate = function (username, password) {
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
    FakeAuthService.prototype.logout = function () {
        this.AppConfig.emailAddress = undefined;
        this.AppConfig.save();
    };
    return FakeAuthService;
}());
ngmodule_1.ngmodule.service("AuthService", FakeAuthService);
//# sourceMappingURL=auth.js.map