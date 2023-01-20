$("#search-button").click(function() {
    $.getJSON("/hunter/search_facilities_json?",{
        search_word: $("#search-word").val(),
        region: $("#region").val()})
        .done(function(data) {
            if (data.length != 0) {
                let result_html = "";
                for (let i in data) {
                    result_html += '<a href="/hunter/facility_detail?id='+ data[i]["id"] +'">'+ data[i]["user_name"] +'</a><br>';
                }
                $("#search-results").html(result_html);
            } else {
                $("#search-results").html("<p>検索結果は0件です</p>");
            }
        })
})