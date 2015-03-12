//
// Initialize the base map
//
var map;

function initialize() {
  var mapOptions = {
    zoom: 2,                                    // Zoom level that shows the whole world
    center: new google.maps.LatLng(0, 150),     // In the middle of Pacific Ocean
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

// This code assumes the WebSocket is hosted on the same server/port
// With the path of "/ws"
function getWebSocketServerUrl() {
   return ('ws' + (document.location.protocol === 'https:' ? 's' : '') +  '://' +
          document.location.hostname + ':' + document.location.port + '/ws');
}

google.maps.event.addDomListener(window, 'load', initialize);


function getColor(speed) {
  if (speed > 10) {
     return "red"
  } else if (speed > 5) {
     return "yellow"
  } else {
     return "green"
  }
}

function stopAnimiation(marker) {
    setTimeout(function () {
          marker.setAnimation(null);
        }, 2000);
}

function fadeAndRemoveMarker(marker) {

    var interval = setInterval(function () {
      marker.setOpacity(Math.max(0, marker.getOpacity() - 0.1));
    }, 10000);

    setTimeout(function () {
      clearInterval(interval);
      marker.setMap(null);
    }, 60000);
}


// Start the WebSocket
var ws = new WebSocket(getWebSocketServerUrl());

ws.onmessage = function (evt)
{
  var response = JSON.parse(evt.data);

  (function() {
  var iplookupUrl = '//freegeoip.net/json/' + response.ip;
  $.getJSON(iplookupUrl)
    .done( function( data ) {
        var latlong = new google.maps.LatLng(data.latitude, data.longitude);
        var marker = new google.maps.Marker({
            position: latlong,
            map: map,
            animation: google.maps.Animation.BOUNCE,
            title: data.city,
            opacity: 1.0,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: getColor(response.speed),
                scale: 5
            },
          });
        map.panTo(latlong);

        stopAnimiation(marker);
        fadeAndRemoveMarker(marker);
      })
})();
};


