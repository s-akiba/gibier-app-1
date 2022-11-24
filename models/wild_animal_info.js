'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wild_animal_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      wild_animal_info.hasMany(models.commodities, {
        foreignKey: "wild_animal_info_id"
      });
      wild_animal_info.hasMany(models.vermin_hunted, {
        foreignKey: "wild_animal_info_id"
      });
      wild_animal_info.hasMany(models.vermin_info, {
        foreignKey: "wild_animal_info_id"
      });
      wild_animal_info.hasMany(models.req_from_facility, {
        foreignKey: "wild_animal_info_id"
      });
      wild_animal_info.hasMany(models.req_from_purchaser, {
        foreignKey: "wild_animal_info_id"
      });
    }
  }
  wild_animal_info.init({
    wild_animal_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'wild_animal_info',
  });
  return wild_animal_info;
};