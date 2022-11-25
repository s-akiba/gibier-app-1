const bcrypt = require('bcrypt'); 
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
   let pas = bcrypt.hashSync("password", 10);
   return queryInterface.bulkInsert("users", [
    { email: "test@example.com",
    password: pas,
    is_facility: false,
    is_purchaser: true,
    is_hunter: false,
    is_admin: true,
    region_id: "15",
    user_name: "テストユーザー",
    address: "千代田区",
    bio: "aaa",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
   ])
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
