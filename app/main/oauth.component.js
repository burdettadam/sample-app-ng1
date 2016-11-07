  class OAuthController{
  constructor(AuthService, $http ) {

    AuthService.getOAuthAccessToken(AuthService.retrieveOAuthCode(), function(oauth_payload)
    {
    if (!oauth_payload.OAUTH_ECI) {
      alert("Authentication failed. We apologize for this inconvenience. Please try again.");
    } else {
           console.log("Authorized");            // display authorization 
          /// Devtools.initAccount({}, function(kns_directives){ // bootstraps
          //  console.log("Received directives from bootstrap.execute: ", kns_directives);
          //  $.mobile.loading("hide");
         //   window.location = "index.html";
         // });
           //window.location = "index.html";
          this.$state.go('welcome', {}, { reload: false });
         }
       },
       function(json){
        console.log("something went wrong with the OAuth authorization " + json);
        alert("Something went wrong with your authorization. Please try again. ");
        // not ideal, but...
        window.location = "https://kibdev.kobj.net/login";
      },$http
      );

  }

}


  export const oauth = {
  controller: OAuthController,
  template: `
    <div class="oauth">
    </div>
`};
