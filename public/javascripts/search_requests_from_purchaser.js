$("#search-button").click(function() {
    $.getJSON("/facility/search_requests_from_purchaser_json?",{
        search_word: $("#search-word").val(),
        category: $("#category-options").val(),
        animal: $("#animal-options").val()})
        .done(function(data) {
            if (data.length != 0) {
                let result_html = '<ul class="list-group list-group-flush"><div calss="row">';
                result_html += '<div class="row"><div class="col-3 text-center">依頼者名</div><div class="col-3 text-center">害獣名</div><div class="col-3 text-center">カテゴリ</div><div class="col-3 text-center">期限</div></div>'
                for (let i in data) {
                    let d = new Date(data[i]["appointed_day"]);
                    result_html += '<a href="/facility/public_request_from_purchaser_detail?id='+ data[i]["id"] +'" class="list-group-item list-group-item-action">'
                    +'<div class="row"><div class="col-3 text-center">'+data[i]["request_user"]["user_name"]+'</div><div class="col-3 text-center">'+data[i]["wild_animal_info"]["wild_animal_name"]+'</div><div class="col-3 text-center">'+data[i]["category"]["category_name"]+'</div><div class="col-3 text-center">'+(d.getMonth()+1) + '月 ' + d.getDate() + '日 ' + d.getHours() + '時' + d.getMinutes() + '分'+'</div></div>'
                    +'</a>'
                }
                result_html += '</div></ul>';
                $("#search-results").html(result_html);
            } else {
                $("#search-results").html("<p>検索結果は0件です</p>");
            }
        })
})