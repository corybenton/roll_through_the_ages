const Monuments = require('./monuments')
const Developments = require('./developments')
const gameState = require('./gameState')
const Goods = require('./goods')



Monuments.belongsTo(gameState, {
    foreignKey: 'gameState_id',
});

Goods.belongsTo(gameState, {
    foreignKey: 'gameState_id',
});

Developments.belongsTo(gameState, {
    foreignKey: 'gameState_id',
});

gameState.hasMany(Monuments);
gameState.hasMany(Goods);
gameState.hasMany(Developments);



module.exports = {
    Monuments,
    Developments,
    gameState,
    Goods
}
