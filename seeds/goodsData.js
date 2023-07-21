const { Goods } = require('../models');

const goodsData = require('../initialResources/goods');

const seedGoods = () => Goods.bulkCreate(goodsData);

module.exports = seedGoods;