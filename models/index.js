const Monuments = require('./monuments');
const Developments = require('./developments');
const GameState = require('./gameState');
const Goods = require('./goods');
const User = require('./users');

Monuments.belongsTo(GameState, {
  foreignKey: 'gamestate_id',
});

Goods.belongsTo(GameState, {
  foreignKey: 'gameState_id',
});

Developments.belongsTo(GameState, {
  foreignKey: 'gameState_id',
});

GameState.hasMany(Monuments, {
  foreignKey: 'gameState_id',
});

GameState.hasMany(Goods, {
  foreignKey: 'gameState_id',
});

GameState.hasMany(Developments, {
  foreignKey: 'gameState_id',
});

GameState.belongsTo(User, {
  foreignKey: 'player',
});

User.hasOne(GameState, {
  foreignKey: 'player',
});

module.exports = {
  Monuments,
  Developments,
  GameState,
  Goods,
  User
};
