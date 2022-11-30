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
     let pas1 = bcrypt.hashSync("password", 10);
     let pas2 = bcrypt.hashSync("password", 10);
   return queryInterface.bulkInsert("users", [
    {email: "test1@example.com",
    password: pas,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: true,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー①",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test2@example.com",
    password: pas1,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: true,
    region_id: "15",
    user_name: "購入者ユーザー",
    address: "千代田区",
    bio: "購入者ユーザー①",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test3@example.com",
    password: pas2,
    is_facility: true,
    is_purchaser: false,
    is_hunter: true,
    is_admin: true,
    region_id: "15",
    user_name: "狩猟者ユーザー",
    address: "千代田区",
    bio: "狩猟者ユーザー①",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
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
