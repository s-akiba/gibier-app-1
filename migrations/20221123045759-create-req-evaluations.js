'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('req_evaluations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      req_from_facility_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
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
      condition: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
        allowNull: false,
      },
      support: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
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
    await queryInterface.dropTable('req_evaluations');
  }
};