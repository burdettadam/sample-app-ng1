/**
 * This service stores and retrieves user preferences in session storage
 */
export class AppConfig {
  constructor() {
    this.sort = '+date';
    this.emailAddress = undefined;
    this.restDelay = 100;

    this.clientKey = "CE0C05EA-85F9-11E6-884F-74B0E71C24E1";
    this.anonECI = "85255500-0b65-0130-243c-00163ebcdddd";
    this.callbackURL = "http://localhost:8000/code.html";
    this.host = "kibdev.kobj.net"; // change to cs.kobj.net when in production
    this.login_server = "kibdev.kobj.net"; // change to accounts.kobj.net when in production
    this.eventPath = 'sky/event';
    this.functionPath ='sky/cloud';
    this.client_state = 'null';

    this.defaultECI = "none";
    this.access_token = "none";

    this.load();// what does load do? should it be save?
    // does this load a appConfig session into the session??

  }

  load() {
    try {
      return angular.extend(this, angular.fromJson(sessionStorage.getItem("appConfig")))
    } catch (Error) { }

    return this;
  }

  save() {
    sessionStorage.setItem("appConfig", angular.toJson(angular.extend({}, this)));
  }
}