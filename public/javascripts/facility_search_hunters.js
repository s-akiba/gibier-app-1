$("#search-button").click(function() {
    $.getJSON("/facility/search_hutner_json?",{
        search_word: $("#search-word").val(),
        region: $("#region").val()})
        .done(function(data) {
            if (data.length != 0) {
                let result_html = '<ul class="list-group list-group-flush">';
                for (let i in data) {
                    // result_html += '<a href="/hunter/facility_detail?id='+ data[i]["id"] +'">'+ data[i]["user_name"] +'</a><br>';
                    result_html += '<a href="/facility/hunter_detail?id='+ data[i]["id"] +'" class="list-group-item list-group-item-action">'+ data[i]["user_name"] +'</a>'
                }
                result_html += '</ul>';
                $("#search-results").html(result_html);
            } else {
                $("#search-results").html("<p>検索結果は0件です</p>");
            }
        })
})