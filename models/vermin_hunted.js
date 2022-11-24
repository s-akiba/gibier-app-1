'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vermin_hunted extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      vermin_hunted.hasMany(models.commodities, {
        foreignKey: "vermin_hunted_id"
      });
      vermin_hunted.belongsTo(models.req_from_facility, {
        foreignKey: "req_from_facility_id",
        targetKey: "id"
      });
      vermin_hunted.belongsTo(models.users, {
        foreignKey: "user_id",
        targetKey: "id"
      });
      vermin_hunted.belongsTo(models.wild_animal_info, {
        foreignKey: "wild_animal_info_id",
        targetKey: "id"
      });
    }
  }
  vermin_hunted.init({
    req_from_facility_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    wild_animal_info_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    laitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'vermin_hunted',
  });
  return vermin_hunted;
};