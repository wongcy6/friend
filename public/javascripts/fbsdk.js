window.fbAsyncInit = function() {
  FB.init({
    appId      : '428840807281643',
    xfbml      : true,
    version    : 'v2.2'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response) {
 console.log(response);
 if (response.status === 'connected') {
   FB.api('/me', function(me) {
     console.log(JSON.stringify(me));
     $("#status").text("Hello " + me.first_name + " email: " + me.email + " " + me.id );
   });
 } else if (response.status === 'not_authorized') {
   $("#status").text("Unauthorized!");
 } else {
   $("#status").text("Unknown");
 }
}