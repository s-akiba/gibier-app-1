'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      purchase_info_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        defaultValue: "",
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
    await queryInterface.dropTable('purchase_chats');
  }
};