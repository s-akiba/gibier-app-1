'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('commodities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      vermin_hunted_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      wild_animal_info_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      category_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      detail: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      image_link: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      selling_term: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('commodities');
  }
};