'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commodities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      commodities.hasMany(models.purchase_info, {
        foreignKey: "commodity_id"
      });
      commodities.belongsTo(models.users, {
        foreignKey: "user_id",
        targetKey: "id"
      });
      commodities.belongsTo(models.vermin_hunted, {
        foreignKey: "vermin_hunted_id",
        targetKey: "id"
      });
      commodities.belongsTo(models.wild_animal_info, {
        foreignKey: "wild_animal_info_id",
        targetKey: "id"
      });
      commodities.belongsTo(models.categories, {
        foreignKey: "category_id",
        targetKey: "id"
      });
    }
  }
  commodities.init({
    user_id: DataTypes.INTEGER,
    vermin_hunted_id: DataTypes.INTEGER,
    wild_animal_info_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    detail: DataTypes.TEXT,
    image_link: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    selling_term: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'commodities',
  });
  return commodities;
};