'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class regions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      regions.hasMany(models.users, {
        foreignKey: "region_id"
      });
      regions.hasMany(models.req_from_facility, {
        foreignKey: "region_id"
      });
      regions.hasMany(models.req_from_purchaser, {
        foreignKey: "region_id"
      });
      regions.hasMany(models.vermin_info, {
        foreignKey: "region_id"
      });
    }
  }
  regions.init({
    region_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'regions',
  });
  return regions;
};