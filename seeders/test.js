var fs = require("fs");
var prefectures_t= fs.readFileSync("./prefectures.json", {encoding: 'utf-8'});
var df_t = JSON.parse(prefectures_t);

console.log(JSON.stringify(df_t["prefectures"], null, 2));

var dummyJSON = [];

for (let i in df_t["prefectures"]) {
    dummyJSON.push({
        region_name: df_t["prefectures"][i]["name"],
        createdAt: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }),
        updatedAt: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
    });
}

console.log(dummyJSON);