'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class req_from_facility_chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      req_from_facility_chats.belongsTo(models.users, {
        foreignKey: "user_id",
        targetKey: "id"
      });
      req_from_facility_chats.belongsTo(models.req_from_facility, {
        foreignKey: "req_from_facility_id",
        targetKey: "id"
      });
    }
  }
  req_from_facility_chats.init({
    req_from_facility_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'req_from_facility_chats',
  });
  return req_from_facility_chats;
};