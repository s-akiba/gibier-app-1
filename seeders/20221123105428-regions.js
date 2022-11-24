var fs = require("fs");
var prefectures_t= fs.readFileSync("./seeders/prefectures.json", {encoding: 'utf-8'});
var df_t = JSON.parse(prefectures_t);
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     var dummyJSON = [];

     for (let i in df_t["prefectures"]) {
         dummyJSON.push({
             region_name: df_t["prefectures"][i]["name"],
             createdAt: new Date(),
             updatedAt: new Date()
         });
     }
   return queryInterface.bulkInsert("regions", dummyJSON);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
