const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Developments extends Model {}

Developments.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    learned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    points: {
      type: DataTypes.INTEGER,
    },
    effect: {
      type: DataTypes.STRING,
    },
    gameState_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'gameState',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'developments',
  }
);

module.exports = Developments;