// Converts HTML5 geolocation data into a google maps location object
newLatLng = function (success) {
   return new google.maps.LatLng(success.coords.latitude, success.coords.longitude);
};

// Takes a google maps location object (latLng), creates the map and centers it at latLng.
createMap = function(latLng) {
  var mapOptions = {
    streetViewControl: false,
    scrollwheel: false,
    zoom: 14,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
};

/* The click listener watches for clicks on the map, extracts the Lat & Lng and calls
   getNewPhotos with the new latLng object. */
addClickListener = function() {
  google.maps.event.addListener(map, 'click', function(event){
    var currentPos = {lat: event.latLng.lat(), lng: event.latLng.lng(), dist: '1000'};
    placeClickMarker(event.latLng);
    getNewPhotos(currentPos);
  });
};

/* addAutocomplete uses the Google Maps API to create a search field, process the input to get
   the Lat & Lng for the selected location.  It passes the new latLng to getNewPhotos and
   set map center and place new marker */
addAutocomplete = function() {
  var input = document.getElementById('searchTextField');
  autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    getNewPhotos({lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), dist: '3000'});
    placeClickMarker(place.geometry.location);
    map.setCenter(place.geometry.location);
    map.setZoom(15);
  });
};

// Nav marker is placed only once, at the users location (if it is avaliable)
placeNavMarker = function(latLng) {
  var image = "http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/blank.png";
  var blueIcon = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: image
  });
};

// Instagram markers are placed for every photo, using the Lat & Lng information for the photo
placeInstaMarkers = function(data, map) {
  for (var i = 0; i < data.length; i++) {

    var marker = data[i];
    var latitude = marker.lat ||
      (marker.location &&  marker.location.latitude);
    var longitude = marker.lng ||
      (marker.location && marker.location.longitude);

    if (!latitude || !longitude) {
      console.error('Latitude and longitude are required for placing markers');
      continue;
    }

    console.log(latitude, longitude);

    var latLng = new google.maps.LatLng(latitude, longitude);
    var image = '/instagram-shadow.png';
    var instaMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: image
    });
    instaMarker.setAnimation(google.maps.Animation.DROP);
    addInfoWindow(data, instaMarker, i);
  }
};

// This funciton creates new InfoWindows for each photo.
addInfoWindow = function(data, instaMarker, i){
  var username = data[i].user.username;
  var caption;
  if ( !data[i].caption ) {
    caption = "No Comment..";
  } else {
    caption = data[i].caption.text;
  }
  var infowindow = new google.maps.InfoWindow({
    content:
    '<img class="popupPhoto" src="'+ data[i].images.standard_resolution.url +'"/><br/>'+
    '<div class="userInfo">'+
      '<a href="http://instagram.com/'+ username +'" target="_blank">'+
        '<img class="profilePicture" src="'+ data[i].user.profile_picture +'"/>'+
        '<span class="popupText">@'+ username +'</span>'+
      '</a>' +
      '<p class="caption">'+ caption + '</p>' +
    '</div>'
  });
  infowindow.setOptions({maxWidth:250});
  infowindow.setOptions({maxHeight:300});

  google.maps.event.addListener(instaMarker, 'click', function() {
    deleteInstaMarkers(this);
    infowindow.open(map, this);
    instaArray.push(instaMarker);
  });
};

// Assures only one Instagram marker is open on the map at a time.
deleteInstaMarkers = function() {
  if (instaArray) {
    for (var i in instaArray) {
      instaArray[i].setMap(null);
    }
  }
  instaArray.length = 0;
};

// Places a single red marker when the user clicks anywhere on the map.
placeClickMarker = function(location) {
  deleteOverlays();
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markersArray.push(marker);
};

// Assures only one click marker is on the screen at a time, called by placeClickMarker.
deleteOverlays = function() {
  if (markersArray) {
    for (var i in markersArray) {
      markersArray[i].setMap(null);
    }
  markersArray.length = 0;
  }
};

//HERE ARE MY INSTAGRAM HELPER FUNCTIONS:

// Processses the json data on ajax success
jsonLoad = function(json) {

  console.log('jsonLoad was called with arguments', arguments);

  if (json.meta.code == 200) {
    var show = json.data;

    var truncatedLength = Math.floor(show.length/3) * 3;
    console.log(truncatedLength, show);
    show = show.slice(0, truncatedLength);

    placeInstaMarkers(show, map);
    Session.set('photoset', show);
    $(event.target.children[1]).hide();
  } else {
    // 200 - things went well
    // else - <something> went wrong, but we're not really sure what.. it could be anything
    alert("Something went wrong trying to talk to Instagram!");
    console.log(json);
  }
};

// Basic ajax call to instagram API, searching for photos within specified distance of passed in place
getNewPhotos = function (data) {

  console.log(data);

  var url,
      dist,
      success,
      query = {
        order: '-createdAt',
        client_id: INSTAID,
        access_token: ACCESSTOKEN
      };

  if (data.lat && data.lng && (data.distance || data.dist)) {
    dist = data.distance || data.dist;
    url = 'https://api.instagram.com/v1/media/search?callback=?';
    query = _(query).extend({lat: data.lat, lng: data.lng, distance: dist});
    success = jsonLoad;
  } else if (data.tagName) {
    url = 'https://api.instagram.com/v1/tags/' + data.tagName + '/media/recent?callback=?';
    success = jsonLoad;
  } else {
    throw new Error("You must provide either a location or a hashtag");
  }

  $.ajax({
    url: url,
    dataType: 'json',
    data: query,
    success: success,
    statusCode: {
      500: function () {
        alert('Sorry, service is temporarily down.');
      }
    }
  });

};
