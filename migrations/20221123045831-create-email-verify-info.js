'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('email_verify_infos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false,
      },
      is_facility: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_purchaser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      is_hunter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      effective_date: {
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
    await queryInterface.dropTable('email_verify_infos');
  }
};