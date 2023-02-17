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
   return queryInterface.bulkInsert("categories", [
    {category_name: "その他",
    createdAt: new Date(),
    updatedAt: new Date()},
    {category_name: "背ロース",
    createdAt: new Date(),
    updatedAt: new Date()},
    {category_name: "バラ",
    createdAt: new Date(),
    updatedAt: new Date()},
    {category_name: "モモ",
    createdAt: new Date(),
    updatedAt: new Date()},
    {category_name: "スネ",
    createdAt: new Date(),
    updatedAt: new Date()},
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
