"use strict";
/**
 * The controller for the `login` component
 *
 * The `login` method validates the credentials.
 * Then it sends the user back to the `returnTo` state, which is provided as a resolve data.
 */
var LoginController = (function () {
    function LoginController(AppConfig, AuthService, $state, $scope) {
        var _this = this;
        this.getURL = function (type, fragment) {
            if (typeof this.login_server === "undefined") {
                this.login_server = this.host;
            }
            var client_state = Math.floor(Math.random() * 9999999);
            //var current_client_state = window.localStorage.getItem("wrangler_CLIENT_STATE");
            //if (this.AppConfig.client_state === undefined) { // we allways want to update state before oauth right???
            console.log("client_state before", this.AppConfig.client_state);
            this.AppConfig.client_state = client_state;
            console.log("client_state", client_state);
            console.log("client_state after", this.AppConfig.client_state);
            this.AppConfig.save();
            console.log("client_state after save", this.AppConfig.client_state);
            //window.localStorage.setItem("manifold_CLIENT_STATE", client_state.toString());
            // }
            var url = 'https://' + this.login_server +
                '/oauth/authorize' + type + '?response_type=code' +
                '&redirect_uri=' + encodeURIComponent(this.callbackURL + (fragment || "")) +
                '&client_id=' + this.clientKey +
                '&state=' + this.AppConfig.client_state;
            console.log("client_state", this.AppConfig.client_state);
            return (url);
        };
        this.getOAuthURL = function (fragment) {
            return (this.getURL('', fragment));
        };
        this.getOAuthNewAccountURL = function (fragment) {
            return (this.getURL('/newuser', fragment));
        };
        this.plant_authorize_button = function ($scope, AuthService, AppConfig) {
            //Oauth through kynetx
            console.log("plant authorize button");
            var OAuth_kynetx_URL = this.getOAuthURL();
            $scope.authorize_link = OAuth_kynetx_URL;
            var OAuth_kynetx_newuser_URL = this.getOAuthNewAccountURL();
            $scope.create_link = OAuth_kynetx_newuser_URL;
            $scope.account_link = "https://" + AppConfig.login_server + "/login/profile";
            /*   $('#logout-link').off('tap').on('tap', function(event) {
                   window.open("https://" + AppConfig.login_server + "/login/logout?" + Math.floor(Math.random() * 9999999), "_blank");
                //   AuthService.removeSession(true); // true for hard reset (log out of login server too) //////////////////////////////////??????????????????????????????????????
                   $state.go('login', {}, { reload: true, transition : 'slide' }); //$.mobile.changePage('#page-authorize', {
                   //    transition: 'slide'
                   //}); // this will go to the authorization page.
               });*/
        };
        // set up app defaults 
        this.AppConfig = AppConfig;
        this.clientKey = AppConfig.clientKey;
        this.anonECI = AppConfig.anonECI;
        this.callbackURL = AppConfig.callbackURL;
        this.host = AppConfig.host;
        this.login_server = AppConfig.login_server;
        this.eventPath = AppConfig.eventPath;
        this.functionPath = AppConfig.functionPath;
        this.defaultECI = AppConfig.defaultECI; // "none"
        this.access_token = AppConfig.access_token; // "none"
        // retrieveSession(); // I dont think we need this here.
        this.plant_authorize_button($scope, AuthService, AppConfig); // plant buttons 
        //this.usernames = AuthService.usernames;
        this.credentials = {
            username: AppConfig.emailAddress,
            password: 'password'
        };
        this.login = function (credentials) {
            _this.authenticating = true;
            var returnToOriginalState = function () {
                var state = _this.returnTo.state();
                var params = _this.returnTo.params();
                var options = Object.assign({}, _this.returnTo.options(), { reload: true });
                $state.go(state, params, options);
            };
            var showError = function (errorMessage) {
                return _this.errorMessage = errorMessage;
            };
            AuthService.authenticate(credentials.username, credentials.password)
                .then(returnToOriginalState)
                .catch(showError)
                .finally(function () { return _this.authenticating = false; });
        };
    }
    return LoginController;
}());
/**
 * This component renders a faux authentication UI
 *
 * It prompts for the username/password (and gives hints with bouncy arrows)
 * It shows errors if the authentication failed for any reason.
 */
exports.login = {
    bindings: { returnTo: '<' },
    controller: LoginController,
    template: "\n    <div class=\"container\">\n      <div class=\"col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2\">\n        <h3>Log In</h3>\n        <p></p>\n        <hr>\n    \n        <div>\n          <label for=\"username\">Username:</label>\n          <select class=\"form-control\" name=\"username\" id=\"username\"\n            ng-model=\"$ctrl.credentials.username\" ng-options=\"username for username in $ctrl.usernames\"></select>\n          <i style=\"position: relative; bottom: 1.8em; margin-left: 10em; height: 0\"\n              ng-hide=\"$ctrl.credentials.username\" class=\"fa fa-arrow-left bounce-horizontal\"> Choose </i>\n        </div>\n        <br>\n    \n        <div>\n          <label for=\"password\">Password:</label>\n          <input class=\"form-control\" type=\"password\" name=\"password\" ng-model=\"$ctrl.credentials.password\">\n          <i style=\"position: relative; bottom: 1.8em; margin-left: 5em; height: 0\"\n              ng-hide=\"!$ctrl.credentials.username || $ctrl.credentials.password == 'password'\" class=\"fa fa-arrow-left bounce-horizontal\">\n            Enter '<b>password</b>' here\n          </i>\n        </div>\n        <a id=\"authorize-link\" ng-href=\"{{authorize_link}}\" data-transition=\"slide\" class=\"ui-btn ui-corner-all ui-btn-b ui-shadow ui-btn-inline\">Authorize with Kynetx</a><br>\n\n        <a id=\"create-link\" ng-href=\"{{create_link}}\" data-transition=\"slide\" class=\"ui-btn ui-corner-all ui-btn-a ui-shadow ui-btn-inline\">Create Kynetx Account</a><br>\n  \n        <a id=\"account-link\" ng-href=\"{{account_link}}\" data-transition=\"slide\" class=\"ui-btn ui-corner-all ui-btn-a ui-shadow ui-btn-inline\">My Kynetx Profile</a>\n    \n        <div ng-show=\"$ctrl.errorMessage\" class=\"well error\">{{ $ctrl.errorMessage }}</div>\n    \n        <hr>\n        <div>\n          <button class=\"btn btn-primary\" type=\"button\"\n              ng-disabled=\"$ctrl.authenticating\" ng-click=\"$ctrl.login($ctrl.credentials)\">\n            <i class=\"fa fa-spin fa-spinner\" ng-show=\"$ctrl.authenticating\"></i> <span>Log in</span>\n          </button>\n          <i ng-show=\"$ctrl.credentials.username && $ctrl.credentials.password == 'password'\" style=\"position: relative;\" class=\"fa fa-arrow-left bounce-horizontal\"> Click Me!</i>\n      </div>\n    </div>\n    "
};
//# sourceMappingURL=login.component.js.map