var map;

function initialize() {
  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(0, 150),
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

}

google.maps.event.addDomListener(window, 'load', initialize);

var ws = new WebSocket('ws' +
     (document.location.protocol === 'https:' ? 's' : '') +
     '://' + document.location.hostname + ':' + document.location.port + '/ws');

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
            opacity: 1.0
          });
        map.panTo(latlong);
        setTimeout(function () {
          marker.setAnimation(null);
        }, 6000);
        var interval = setInterval(function () {
          marker.setOpacity(Math.max(0, marker.getOpacity() - 0.1));
        }, 1000);
        setTimeout(function () {
          clearInterval(interval);
          marker.setMap(null);
        }, 60000);
      })
})();
};
