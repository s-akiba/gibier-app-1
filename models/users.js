'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.belongsTo(models.regions, {
        foreignKey: "region_id",
        targetKey: "id"
      });
      users.hasMany(models.vermin_hunted, {
        foreignKey: "user_id"
      });
      users.hasMany(models.purchase_info, {
        foreignKey: "user_1_id"
      });
      users.hasMany(models.purchase_info, {
        foreignKey: "user_2_id"
      });
      users.hasMany(models.commodities, {
        foreignKey: "user_id"
      });
      users.hasMany(models.vermin_info, {
        foreignKey: "user_id"
      });
      users.hasMany(models.req_from_purchaser, {
        foreignKey: "user_1_id"
      });
      users.hasMany(models.req_from_purchaser, {
        foreignKey: "user_2_id"
      });
      users.hasMany(models.req_from_purchaser_chats, {
        foreignKey: "user_id"
      });
      users.hasMany(models.req_evaluations, {
        foreignKey: "user_1_id"
      });
      users.hasMany(models.req_evaluations, {
        foreignKey: "user_2_id"
      });
      users.hasMany(models.purchase_chats, {
        foreignKey: "user_id"
      });
      users.hasMany(models.req_from_facility, {
        foreignKey: "user_1_id"
      });
      users.hasMany(models.req_from_facility, {
        foreignKey: "user_2_id"
      });
      users.hasMany(models.req_from_facility_chats, {
        foreignKey: "user_id"
      });
      users.hasMany(models.notifications, {
        foreignKey: "user_id"
      });
    }
  }
  users.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_facility: DataTypes.BOOLEAN,
    is_purchaser: DataTypes.BOOLEAN,
    is_hunter: DataTypes.BOOLEAN,
    is_admin: DataTypes.BOOLEAN,
    region_id: DataTypes.INTEGER,
    user_name: DataTypes.STRING,
    address: DataTypes.STRING,
    bio: DataTypes.TEXT,
    balance: DataTypes.INTEGER,
    is_invalid: DataTypes.BOOLEAN,
    last_logged_on: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};