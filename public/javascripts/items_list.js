$("#search-button").click(function() {
    $.getJSON("/purchaser/items_list_json?", {
        animal_id: $("#animal_options").val(),
        category_id: $("#category_options").val(),
        facility_name: $("#facility").val()
    })
    .done((data) => {
        console.log(data);
        if (data.length != 0) {
            let result_html = '';
            for (let i in data) {
                result_html += '<div class="col"><div class="card"><a href="/purchaser/item_detail?id=' + data[i]["id"] + '"><img src="/uploads/' + data[i]["image_link"] + '" class="card-img-top" ></a>';
                result_html += '<div class="card-body"><p>￥'+ data[i]["price"] +'</p><p>在庫：'+ data[i]["stock"] +'個</p><span class="prd-lst-span">';
                result_html += '<form action="/purchaser/add_cart" method="post"><input type="hidden" name="id" value="'+ data[i]["id"] +'"><input type="hidden" name="facility_id" value="'+ data[i]["user_id"] +'"><label for="quantity">購入数：</label>';
                result_html += '<input type="number" min="1" max="'+ data[i]["stock"] +'" class="num_textbox" name="quantity" required>個<button type="submit" class="add-cart-button">カートに入れる</button></form></span></div></div></div>';
            }
            $("#search-results").html(result_html);
        } else {
            $("#search-results").html('<h2 class="mb-5">検索結果は0件です</h2>');
        }
    })
})