
var map = L.map('map', {
    zoomsliderControl: true,
    zoomControl: false})
    .setView([35.6986075,139.756673], 16);

var searchLayer = new L.LayerGroup();

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


$('#search-vermin-button').click(function() {
    if ($("#select-regions").val() == '0') {
        alert("地域は必ず選択してください。");
    } else {
        // $("input[type='checkbox']").prop("checked", false);
        $.getJSON("/hunter/search_vermin_infos_json?",
        {region: $('#select-regions').val(),
        animal: $('#select-animals').val(),
        start_day: $("#start_day").val(),
        end_day: $("#end_day").val()}
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
                    icon: 'paw',
                    markerColor: 'red',
                    iconColor: "white"
                };
                let html_data = "";
                for (i in data) {
                    html_data += "<p>"+ data[i]["id"] +"</p>"
                    let each_marker = L.marker([data[i]["latitude"], data[i]["longitude"]], {icon: L.AwesomeMarkers.icon(fa_options)}).bindPopup(data[i]["createdAt"]);
                    searchLayer.addLayer(each_marker);
                }
                
                $("#search-results").html(html_data);
                // $("input[type='checkbox']").prop("checked", true);
            } else {
                $(".awesome-marker-icon-red").remove();
                $(".awesome-marker-shadow").remove();
                $("#results-count").text("検索結果：0件");
                // $("input[type='checkbox']").prop("checked", true);
            }
        });
    }
});

$("#clear-date").click(function() {
    $("#start_day").val("");
    $("#end_day").val("");
});

$("#set-1month").click(function() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        /* remove second/millisecond if needed - credit ref. https://stackoverflow.com/questions/24468518/html5-input-datetime-local-default-value-of-today-and-current-time#comment112871765_60884408 */
    now.setMilliseconds(null);
    now.setSeconds(null);
    now.setMonth(now.getMonth() -1);
    $("#start_day").val( now.toISOString().slice(0, -1))
});

$("#set-6month").click(function() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        /* remove second/millisecond if needed - credit ref. https://stackoverflow.com/questions/24468518/html5-input-datetime-local-default-value-of-today-and-current-time#comment112871765_60884408 */
    now.setMilliseconds(null);
    now.setSeconds(null);
    now.setMonth(now.getMonth() -6);
    $("#start_day").val( now.toISOString().slice(0, -1))
});

// $("#test").click(function() {
//     console.log(map._layers);
// })