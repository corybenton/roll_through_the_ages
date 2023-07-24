const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Goods extends Model {}

Goods.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number:{
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    value: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gamestate_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'gameState',
        key: 'id',
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'goods',
  }
);

module.exports = Goods;
