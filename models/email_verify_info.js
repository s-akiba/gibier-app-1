'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class email_verify_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  email_verify_info.init({
    email: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    password: DataTypes.STRING,
    is_facility: DataTypes.BOOLEAN,
    is_purchaser: DataTypes.BOOLEAN,
    is_hunter: DataTypes.BOOLEAN,
    effective_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'email_verify_info',
  });
  return email_verify_info;
};