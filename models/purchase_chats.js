'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchase_chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      purchase_chats.belongsTo(models.users, {
        foreignKey: "user_id",
        targetKey: "id"
      });
      purchase_chats.belongsTo(models.purchase_info, {
        foreignKey: "purchase_info_id",
        targetKey: "id"
      });
    }
  }
  purchase_chats.init({
    purchase_info_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'purchase_chats',
  });
  return purchase_chats;
};