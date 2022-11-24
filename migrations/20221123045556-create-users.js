'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // メールアドレス
      email: {
        type: Sequelize.STRING,
        unique: true,
        defaultValue: "",
        allowNull: false,
      },
      // パスワード
      password: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false,
      },
      // 狩猟施設ユーザーフラグ
      is_facility: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // 購入者ユーザーフラグ
      is_purchaser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // 狩猟者ユーザーフラグ
      is_hunter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // 管理者ユーザーフラグ
      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // 地域ID
      region_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      // 氏名/団体名/施設名
      user_name: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false,
      },
      // 住所
      address: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: false,
      },
      // bio
      bio: {
        type: Sequelize.TEXT,
        defaultValue: "",
        allowNull: false,
      },
      // 論理削除フラグ
      is_invalid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      // 最終ログイン日時
      last_logged_on: {
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
    await queryInterface.dropTable('users');
  }
};