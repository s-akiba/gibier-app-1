'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("req_from_purchasers", "category_id", {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn("req_from_purchasers", "num", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultvalue: 1
    });
    await queryInterface.removeColumn("req_from_purchasers", "region_id");
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("req_from_purchasers", "category_id");
    await queryInterface.removeColumn("req_from_purchasers", "num");
    await queryInterface.addColumn("req_from_purchasers", "region_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
  }
};
