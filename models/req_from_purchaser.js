'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class req_from_purchaser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      req_from_purchaser.hasMany(models.req_from_purchaser_chats, {
        foreignKey: "req_from_purchaser_id"
      });
      req_from_purchaser.belongsTo(models.users, {
        foreignKey: "user_1_id",
        targetKey: "id"
      });
      req_from_purchaser.belongsTo(models.users, {
        foreignKey: "user_2_id",
        targetKey: "id"
      });
      req_from_purchaser.belongsTo(models.regions, {
        foreignKey: "region_id",
        targetKey: "id"
      });
      req_from_purchaser.belongsTo(models.wild_animal_info, {
        foreignKey: "wild_animal_info_id",
        targetKey: "id"
      });
    }
  }
  req_from_purchaser.init({
    user_1_id: DataTypes.INTEGER,
    user_2_id: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    wild_animal_info_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    appointed_day: DataTypes.DATE,
    is_public: DataTypes.BOOLEAN,
    is_accepted: DataTypes.BOOLEAN,
    is_closed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'req_from_purchaser',
  });
  return req_from_purchaser;
};