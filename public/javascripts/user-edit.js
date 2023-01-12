var map = L.map('map', {
    zoomsliderControl: true,
    zoomControl: false})
    .setView([35.6986075,139.756673], 16);

let layer1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.addLayer(layer1)


var crossIcon = L.icon({
    iconUrl: 'https://www.achiachi.net/blog/_outside/mapicon/gmap_cross.gif',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

  //センタークロス画像を登録と表示
var crossMarker = L.marker(map.getCenter(),{icon:crossIcon,zIndexOffset:1000,interactive:false}).addTo(map);

  //ムーブイベントでセンタークロスを移動
map.on('move', function(e) {
    crossMarker.setLatLng(map.getCenter());
    outputPos(map);

});

function outputPos(map){
    var pos = map.getCenter();
    //spanに出力
    $("#latitude").val(pos.lat);
    $("#longitude").val(pos.lng);
};
