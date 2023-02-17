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
   return queryInterface.bulkInsert("wild_animal_infos", [
    {wild_animal_name: "その他",
      createdAt: new Date(),
      updatedAt: new Date()},
    {wild_animal_name: "シカ",
      createdAt: new Date(),
      updatedAt: new Date()},
    {wild_animal_name: "イノシシ",
      createdAt: new Date(),
      updatedAt: new Date()},
    {wild_animal_name: "ハクビシン",
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
