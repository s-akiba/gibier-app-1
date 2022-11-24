'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vermin_hunteds', {
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
      user_id: {
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
      laitude: {
        type: Sequelize.DECIMAL,
        defaultValue: 35.0,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL,
        defaultValue: 140.0,
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
    await queryInterface.dropTable('vermin_hunteds');
  }
};