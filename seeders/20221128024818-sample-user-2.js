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
     let pas3 = bcrypt.hashSync("password", 10);
     let pas4 = bcrypt.hashSync("password", 10);
     let pas5 = bcrypt.hashSync("password", 10);
     let pas6 = bcrypt.hashSync("password", 10);
     let pas7 = bcrypt.hashSync("password", 10);
     let pas8 = bcrypt.hashSync("password", 10);
     let pas9 = bcrypt.hashSync("password", 10);
     let pas10 = bcrypt.hashSync("password", 10);
   return queryInterface.bulkInsert("users", [
    {email: "test1@example.com",
    password: pas,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
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
    is_facility: false,
    is_purchaser: true,
    is_hunter: false,
    is_admin: false,
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
    is_facility: false,
    is_purchaser: false,
    is_hunter: true,
    is_admin: false,
    region_id: "15",
    user_name: "狩猟者ユーザー",
    address: "千代田区",
    bio: "狩猟者ユーザー①",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test4@example.com",
    password: pas3,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー2⃣",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test5@example.com",
    password: pas4,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー3⃣",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test6@example.com",
    password: pas5,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー４",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test7@example.com",
    password: pas6,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー⓹",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test8@example.com",
    password: pas7,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー➅",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
{email: "test9@example.com",
    password: pas8,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー7⃣",
    is_invalid: "false",
    last_logged_on: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {email: "test10@example.com",
    password: pas9,
    is_facility: true,
    is_purchaser: false,
    is_hunter: false,
    is_admin: false,
    region_id: "15",
    user_name: "処理施設ユーザー",
    address: "千代田区",
    bio: "処理施設ユーザー8⃣",
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
