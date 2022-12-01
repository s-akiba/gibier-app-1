'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('req_from_purchasers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_1_id: {
        type: Sequelize.INTEGER
      },
      user_2_id: {
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      wild_animal_info_id: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT
      },
      num: {
        type: Sequelize.INTEGER
      },
      appointed_day: {
        type: Sequelize.DATE
      },
      is_public: {
        type: Sequelize.BOOLEAN
      },
      is_accepted: {
        type: Sequelize.BOOLEAN
      },
      is_closed: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('req_from_purchasers');
  }
};