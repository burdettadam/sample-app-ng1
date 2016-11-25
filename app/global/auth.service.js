/**
 * This service emulates an Authentication Service.
 */
export class AuthService {
  constructor(AppConfig, $q, $timeout) {
    this.AppConfig = AppConfig;
    this.$q = $q;
    this.$timeout = $timeout;
    this.usernames = ['myself@angular.dev', 'devgal@angular.dev', 'devguy@angular.dev'];

  }

  /**
   * Returns true if the user is currently authenticated, else false
   */
  isAuthenticated = function(){
      var authd = this.AppConfig.defaultECI != "none";
      if (authd) {
          console.log("Authenicated session");
      } else {
          console.log("No authenicated session");
      }
      return (authd);
 //   return !!this.AppConfig.emailAddress;
  };

  /**
   * Fake authentication function that returns a promise that is either resolved or rejected.
   *
   * Given a username and password, checks that the username matches one of the known
   * usernames (this.usernames), and that the password matches 'password'.
   *
   * Delays 800ms to simulate an async REST API delay.
   */
  

  authenticate(username, password) {
    let { $timeout, $q, AppConfig } = this;

    // checks if the username is one of the known usernames, and the password is 'password'
    const checkCredentials = () => $q((resolve, reject) => {
      var validUsername = this.usernames.indexOf(username) !== -1;
      var validPassword = password === 'password';

      return (validUsername && validPassword) ? resolve(username) : reject("Invalid username or password");
    });

    return $timeout(checkCredentials, 800)
        .then((authenticatedUser) => {
          AppConfig.emailAddress = authenticatedUser;
          AppConfig.save()
        });
  }

  /** Logs the current user out */
  logout() {
    this.AppConfig.defaultECI = "none";
    this.AppConfig.emailAddress = undefined;
    this.AppConfig.save();
  }
  
  manifoldSaveSession = function(token_json)
    {
       var Session_ECI = token_json.OAUTH_ECI;
       var access_token = token_json.access_token;
       console.log("Saving session for ", Session_ECI);
       this.AppConfig.defaultECI = Session_ECI;
       this.AppConfig.access_token = access_token;
       //this.AppConfig.client_state = undefined;
       //kookie_create(Session_ECI);
       this.AppConfig.save();
   };


  getQueryVariable(variable)
    {
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

  //http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  getParameterByName(name, url){
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  retrieveOAuthCode = function()
    {
        //var code = this.getQueryVariable("code");
        var code = this.getParameterByName("code");
        return (code) ? code : "NO_OAUTH_CODE";
    };


  getOAuthAccessToken = function(code, callback, error_func, $http)
    {
        var returned_state = parseInt(this.getParameterByName("state"));
        //var returned_state = parseInt(this.getQueryVariable("state"));
        var expected_state = parseInt(this.AppConfig.client_state);
        //var expected_state = parseInt(window.localStorage.getItem("manifold_CLIENT_STATE"));// is using window localStorage ok in angular?????
        if (returned_state !== expected_state) {
            console.warn("OAuth Security Warning. Client states do not match. (Expected %d but got %d)", expected_state, returned_state);
        }
        console.log("getting access token with code: ", code);
        if (typeof (callback) !== 'function') {
            callback = function() { };
        }
        var url = 'https://' + this.AppConfig.login_server + '/oauth/access_token';
        var datas = JSON.stringify(
          {
            "grant_type": "authorization_code",
            "redirect_uri": this.AppConfig.callbackURL,
            "client_id": this.AppConfig.clientKey,
            "code": code
          });
        console.log("data to send",datas);
        //return $http.post({
        return $http({
                  method: 'POST' ,
                  url: url ,
                  data: datas ,
                  responseType:'json'
                })//url, data ,{ responseType:'json'})
           .then(
               function(response){
                  console.log("Recieved following authorization object from access token request: ", json);
                  if (!response.OAUTH_ECI) {
                    console.error("Received invalid OAUTH_ECI. Not saving session.");
                    callback(response);
                    return;
                  };
                  //wrangler.saveSession(json);
                  this.manifoldSaveSession(response);
              //    window.localStorage.removeItem("manifold_CLIENT_STATE");// moved into saveSession
                  callback(response);
               }, // success callback
               function(response){
                  console.log("Failed to retrieve access token " ); console.log(response);
                  error_func = error_func || function(){};
                  error_func(response);
               }// failure callback
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

}
