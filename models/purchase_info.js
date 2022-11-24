'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchase_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      purchase_info.hasMany(models.purchase_chats, {
        foreignKey: "purchase_info_id"
      });
      purchase_info.belongsTo(models.users, {
        foreignKey: "user_1_id",
        targetKey: "id"
      });
      purchase_info.belongsTo(models.users, {
        foreignKey: "user_2_id",
        targetKey: "id"
      });
      purchase_info.belongsTo(models.commodities, {
        foreignKey: "commodity_id",
        targetKey: "id"
      });
    }
  }
  purchase_info.init({
    commodity_id: DataTypes.INTEGER,
    user_1_id: DataTypes.INTEGER,
    user_2_id: DataTypes.INTEGER,
    num_purchased: DataTypes.INTEGER,
    delivery_address: DataTypes.STRING,
    is_accepted: DataTypes.BOOLEAN,
    is_closed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'purchase_info',
  });
  return purchase_info;
};