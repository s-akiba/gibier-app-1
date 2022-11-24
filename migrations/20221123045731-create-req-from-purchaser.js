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
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      user_2_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      region_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      wild_animal_info_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      appointed_day: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      is_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_closed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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