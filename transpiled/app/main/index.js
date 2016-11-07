"use strict";
var ngmodule_1 = require("../bootstrap/ngmodule");
var app_component_1 = require("./app.component");
var welcome_component_1 = require("./welcome.component");
var login_component_1 = require("./login.component");
var home_component_1 = require("./home.component");
var oauth_component_1 = require("./oauth.component");
var app_states_1 = require("./app.states");
var app_config_1 = require("./app.config");
var mainAppModule = {
    components: { app: app_component_1.app, welcome: welcome_component_1.welcome, login: login_component_1.login, home: home_component_1.home, oauth: oauth_component_1.oauth },
    states: [app_states_1.appState, app_states_1.homeState, app_states_1.loginState, app_states_1.welcomeState, app_states_1.codestate],
    configBlocks: [app_config_1.otherwiseConfigBlock],
    runBlocks: [app_config_1.traceRunBlock]
};
ngmodule_1.loadNg1Module(ngmodule_1.ngmodule, mainAppModule);
//# sourceMappingURL=index.js.map