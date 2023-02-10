var map = L.map('map', {
    zoomsliderControl: true,
    zoomControl: false,
    minZoom: 5})
    .setView([35.6986075,139.756673], 16);

var searchLayer = new L.LayerGroup();

var now_lat, now_lng = "";

function start() {
    // openstreetmap
    let layer1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    
    // map.addLayer(layer1)
    searchLayer.addTo(map)


    
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
        // let overlays = {"ユーザー位置":marker, "検索結果表示":searchLayer};
        let overlays = {"ユーザー位置":marker};
        L.control.layers(baseLayers, overlays,{collapsed:false}).addTo(map);
        // console.log(location.latlng);
        now_lat = location.latlng.lat;
        now_lng = location.latlng.lng;
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



$('#search-button').click(function() {
    if ($("#select-regions").val() == '0') {
        alert("地域は必ず選択してください。");
    } else {
        // $("input[type='checkbox']").prop("checked", false);
        $.getJSON("/hunter/search_facilities_json?",
        {region: $('#select-regions').val()}
        )
        .done(function (data) {
            console.log("receive data:",data.length);
            if (data.length != 0) {
                $(".awesome-marker-icon-red").remove();
                $(".awesome-marker-shadow").remove();
                $("#results-count").text("検索結果："+ data.length +"件");
                // console.log(data[0]);
                let fa_options = {
                    prefix: 'fa',
                    icon: 'industry',
                    markerColor: 'red',
                    iconColor: "white"
                };
                
                for (i in data) {
                    let popup_data = '';
                    if (now_lat != "") {
                        popup_data += '処理施設名：'+ data[i]["user_name"] + '<br><a href="https://google.com/maps/dir/'+ now_lat +','+ now_lng +'/'+ data[i]["latitude"] +',' + data[i]["longitude"] + '/@'+ data[i]["latitude"] +','+ data[i]["longitude"] +',10z" target="_blank" rel="noopener noreferrer">google map <i class="fa-solid fa-map-location-dot"></i></a><br>' ;
                    } else {
                        popup_data += '処理施設名：'+ data[i]["user_name"] + '<br><a href="https://google.com/maps/dir//'+ data[i]["latitude"] +',' + data[i]["longitude"] + '/@'+ data[i]["latitude"] +','+ data[i]["longitude"] +',10z" target="_blank" rel="noopener noreferrer">google map <i class="fa-solid fa-map-location-dot"></i></a><br>' ;
                    }
                    
                    popup_data += '<details class="details-address"><summary>住所</summary><p>'+ data[i]["address"] +'</p></details>';
                    let each_marker = L.marker([data[i]["latitude"], data[i]["longitude"]], {icon: L.AwesomeMarkers.icon(fa_options)}).bindPopup(popup_data);
                    searchLayer.addLayer(each_marker);
                }
                map.setView([data[0]["latitude"], data[0]["longitude"]], 9);
            } else {
                $(".awesome-marker-icon-red").remove();
                $(".awesome-marker-shadow").remove();
                $("#results-count").text("検索結果：0件");
            }
        });
    }
});