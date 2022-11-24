'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class req_from_purchaser_chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      req_from_purchaser_chats.belongsTo(models.users, {
        foreignKey: "user_id",
        targetKey: "id"
      });
      req_from_purchaser_chats.belongsTo(models.req_from_purchaser, {
        foreignKey: "req_from_purchaser_id",
        targetKey: "id"
      });
    }
  }
  req_from_purchaser_chats.init({
    req_from_purchaser_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'req_from_purchaser_chats',
  });
  return req_from_purchaser_chats;
};