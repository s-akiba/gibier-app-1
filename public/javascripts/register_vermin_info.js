
var map = L.map('map', {
    zoomsliderControl: true,
    zoomControl: false,
    minZoom: 5})
    .setView([35.6986075,139.756673], 16);


function start() {
    $("#selected-animal").text($("#animal_options").find('option:selected').text());
    
    // openstreetmap
    let layer1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    
    map.addLayer(layer1)



    // let geo_gibier = test();

    let fa_options = {
        prefix: 'fa',
        icon: 'industry',
        markerColor: 'red',
        iconColor: "white"
    };

    
    var marker;
    map.on("locationfound", function(location) {
        let marker_options = {
            pulsing: false
           ,accuracy: 100
           ,smallIcon: true
        };
        if (!marker){
            marker = L.userMarker(location.latlng, marker_options).addTo(map).bindPopup("現在位置");
        }
        marker.setLatLng(location.latlng);
        marker.setPulsing(true);
        
        
        let baseLayers = {'地図':layer1,};
        let overlays = {"ユーザー位置":marker};
        L.control.layers(baseLayers, overlays,{collapsed:false}).addTo(map);
    });
     
    map.on('locationerror', function(e) {
        alert('現在地が取得できませんでした。');
    });
     
    map.locate({
        watch: false,
        locate: true,
        setView: true,
        enableHighAccuracy: true
    });
    
    
}


// function refresh() {
//     map.setView([35.6986075,139.756673], 15);
// }

// $('#a-button').click(function() {
//     $.getJSON("/hunter/getjson", function (json) {
//         alert(json.data1)
//     })
// })

var popup_list = [];
function onMapClick(e) {
    $("#hidden-latitude").val(e.latlng.lat.toString());
    $("#hidden-longitude").val(e.latlng.lng.toString());
    $(".select-latitude").text(e.latlng.lat.toString());
    $(".select-longitude").text(e.latlng.lng.toString());
    var mk = L.marker(e.latlng).addTo(map).on('click', onMarkerClick);
    popup_list.push(mk);
    mk.bindPopup("選択位置").openPopup();
    if (2 <= popup_list.length) {
        map.removeLayer(popup_list[0]);
        popup_list.splice(0, 1);
    }
    if ($(".select-latitude").val() == "") {
        $("#submit-button").prop('disabled', false);
        
    }
}
map.on('click', onMapClick);

function onMarkerClick(e) {
    //マーカーのclickイベント呼び出される
    //クリックされたマーカーを地図のレイヤから削除する

    map.removeLayer(e.target);
}

$("#open").click(function () {
    if ($("#hidden-latitude").val() == "") {
        alert("地点を選択してください");
        console.log("q");
    }
})

// モーダルを開く前に位置を選択させる
function checkLatlangValue() {
    if ($(".select-latitude").val() == "") {
        alert("latitude empty");
        setTimeout(function(){
            $('#close-modal').trigger("click");
       },500);
        
    }
}

// モーダル
// $("#open").click(function(){
//     $("#a").css("display","block");
//     $("#b").css("display","block");
//                 });


// $(".cancel").click(function(){
//     $("#a").fadeOut();
//     $("#b").fadeOut();
// });