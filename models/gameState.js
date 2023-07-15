const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GameState extends Model {}

GameState.init(
{
      id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cities: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
    },
    disasters: {
         type: DataTypes.INTEGER,  
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    player: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'gameState',
  }
);

module.exports = GameState;
