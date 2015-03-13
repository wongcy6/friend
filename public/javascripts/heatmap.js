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
  if (speed > 15000) {
     return "red";
  } else if (speed > 10000) {
     return '#' + (0xFFFF00 - Math.round((speed - 10000)/1000) * 0x003300).toString(16);
  } else if (speed > 5000) {
     return '#' + (0x00FF00 + Math.round((speed - 5000)/1000) * 0x32CD00).toString(16);
  } else {
     return "green";
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
var count = 0;

ws.onmessage = function (evt)
{
  count = count + 1;
  if (count > 240) debugger;
  var response = JSON.parse(evt.data);
  $("#panel").text(count + ' ' + new Date(response.time/1));

  var latlong = new google.maps.LatLng(response.latitude, response.longitude);
  var marker = new google.maps.Marker({
        position: latlong,
        map: map,
        animation: google.maps.Animation.DROP,
        opacity: 1.0,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: getColor(response.pageload),
            scale: 3
        }
     });
//        map.panTo(latlong);


   stopAnimiation(marker);
   fadeAndRemoveMarker(marker);

   //console.log("dads")

}
