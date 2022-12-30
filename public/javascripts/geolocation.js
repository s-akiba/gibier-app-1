


// // 現在位置取得
// navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

// // 取得に成功した場合の処理
// function successCallback(position){
//     // 緯度を取得し画面に表示
//     var latitude = position.coords.latitude;
//     document.getElementById("latitude").innerHTML = latitude;
//     // 経度を取得し画面に表示
//     var longitude = position.coords.longitude;
//     document.getElementById("longitude").innerHTML = longitude;

//     // 現在位置
//     let user1 = L.marker([latitude,longitude]);
//     user1.addTo(map); //map.addLayer(marker1);

//     //以下説明用コード
//     let popupOpt = {autoClose:false,closeOnClick:false,closeButton:false,minWidth:0,};
//     let popup1 = L.popup(popupOpt).setContent('現在位置');
//     user1.bindPopup(popup1);
//     user1.openPopup();

//     let baseLayers = {'国土地理院':layer1,};
//     let overlays = {'神保町駅':marker1,"ユーザー位置":user1,};
//     L.control.layers(baseLayers, overlays,{collapsed:false}).addTo(map);
// };

// // 取得に失敗した場合の処理
// function errorCallback(error){
//     alert("位置情報が取得できませんでした");
// };



var map = L.map('map', {
    zoomsliderControl: true,
    zoomControl: false})
    .setView([35.6986075,139.756673], 16);

function test() {
    let d;
    fetch('/getgeo', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        },
    })
    .then(response => {
        console.log(response);
        d = response.json();
    });
    console.log(d);
    return d
}


function start() {


    // 国土地理院
    // let layer1 = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    //     attribution:'<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
    //     minZoom:2,
    //     maxZoom:18,
    //     });
    
    // openstreetmap
    let layer1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    
    map.addLayer(layer1)
    
    // 神保町駅
    let marker1 = L.marker([35.6960903,139.7544961], {icon: L.AwesomeMarkers.icon({
        prefix: 'fa'
       ,icon: 'train'
       ,markerColor: 'blue'
    })});
    marker1.addTo(map); //map.addLayer(marker1);


    // geojson
    let geo_gibier = {"type":"FeatureCollection",
    "features": [
        {"type": "Feature",
            "properties": {
                "prop0": "京丹波自然工房",
                "prop1": "No-1"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [135.3981964,35.1476328]
            }
        },
        {"type": "Feature",
            "properties": {
                "prop0": "祖谷の地美栄",
                "prop1": "No-2"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [133.8918493,33.8524391]
            }
        },
        {"type": "Feature",
            "properties": {
                "prop0": "信州富士見高原ファーム",
                "prop1": "No-3"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [138.2358229,35.9107344]
            }
        }
    ]
    }

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
        
        let newgeo = L.geoJSON(geo_gibier, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p>'+feature.properties.prop0+'</p> <br><a class="btn" href="https://www.google.com/search?q=' + feature.properties.prop0 + '" target="_blank"> <i class="fa-solid fa-magnifying-glass">検索</i></a>');
            },
            pointToLayer: function(feature, latlng) {
                let mkr;
                mkr = new L.marker(latlng, {icon: L.AwesomeMarkers.icon(fa_options)});
                return mkr
            }
        }).addTo(map);
        
        let baseLayers = {'地図':layer1,};
        let overlays = {'神保町駅':marker1,"ユーザー位置":marker,"施設": newgeo};
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

function refresh() {
    map.setView([35.6986075,139.756673], 15);
}

function alrt(obj) {
    alert("id:"+obj);
}

var popup = L.popup();

function onMapClick(e) {
    $("#hidden-latitude").val(e.latlng.lat.toString());
    $("#hidden-longitude").val(e.latlng.lng.toString());
    $("#select-latitude").text(e.latlng.lat.toString());
    $("#select-longitude").text(e.latlng.lng.toString());
    var mk = L.marker(e.latlng).addTo(map).on('click', onMarkerClick);
    mk.bindPopup("選択位置").openPopup();
    // popup
    //     .setLatLng(e.latlng)
    //     .setContent("You clicked the map at " + e.latlng.toString() )
    //     .openOn(map);
}
map.on('click', onMapClick);

function onMarkerClick(e) {
    //マーカーのclickイベント呼び出される
    //クリックされたマーカーを地図のレイヤから削除する
    map.removeLayer(e.target);
}




function sendGeo(obj) {
    const method = "POST";
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
    const datum = JSON.stringify({
        "geo": obj.value,
        "aaa": "mamam"
    });

    fetch("/test", {method, headers, datum})
    .then((res) => {
        return(res.json())
    })
    .then(alert("d"));
}