'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vermin_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      vermin_info.belongsTo(models.users,{
        foreignKey: "user_id",
        targetKey: "id"
      });
      vermin_info.belongsTo(models.wild_animal_info, {
        foreignKey: "wild_animal_info_id",
        targetKey: "id"
      });
      vermin_info.belongsTo(models.regions, {
        foreignKey: "region_id",
        targetKey: "id"
      });
    }
  }
  vermin_info.init({
    wild_animal_info_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'vermin_info',
  });
  return vermin_info;
};