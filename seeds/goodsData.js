const { Goods } = require('../models');

const goodsData = [
  {
    name: 'Food',
    amount: 3,
    value: 3,
  },
  {
    name: 'Wood',
    amount: 0,
    value: 0,
  },
  {
    name: 'Stone',
    amount: 0,
    value: 0,
  },
  {
    name: 'Pottery',
    amount: 0,
    value: 0,
  },
  {
    name: 'Cloth',
    amount: 0,
    value: 0,
  },
  {
    name: 'Spearheads',
    amount: 0,
    value: 0,
  },
];

const seedGoods = () => Goods.bulkCreate(goodsData);

module.exports = seedGoods;