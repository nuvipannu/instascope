INSTAID = '5ddc29be3311448f8d73bc1fd83bdd52';
markersArray = [];
instaArray = [];
ACCESSTOKEN = "";

Meteor.startup(function(){

  // Gets the users geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } else {
    alert('It seems that Geolocation is not enabled in your browser. Please use a browser which supports the Geolocation API.');
  }

  // If the user has a geolocation, get photos near location and set map center to location.
  function successFunction(success) {
    var navLatLng = newLatLng(success);
    getNewPhotos({lat: success.coords.latitude, lng: success.coords.longitude, distance:'3000'});
    createMap(navLatLng);
    placeNavMarker(navLatLng);
    addClickListener();
    addAutocomplete();
  }

  // If the user did not enable geolocation, get photos and set map near Golden Gate Bridge, because it's always awesome.
  function errorFunction(success) {
    var latlng = new google.maps.LatLng(37.808631, -122.474470);
    getNewPhotos({lat: latlng.lat(), lng: latlng.lng(), distance:'3000'});
    createMap(latlng);
    placeClickMarker(latlng);
    addClickListener();
    addAutocomplete();
  }

  // Initialize state of zoomed image
  $('#zoomed-image').hide();
  Session.set('zoomed', '');

});

Deps.autorun(function(){
  if(Meteor.user()){
    Meteor.call("getAccessToken", function(error, accessToken){
       ACCESSTOKEN = accessToken;
    });
  }
});
