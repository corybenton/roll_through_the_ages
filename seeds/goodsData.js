const { Goods } = require('../models');

const goodsData = [
  {
    id: 0,
    name: 'Food',
    amount: 3,
    value: 3,
  },
  {
    id: 1,
    name: 'Wood',
    amount: 0,
    value: 0,
  },
  {
    id: 2,
    name: 'Stone',
    amount: 0,
    value: 0,
  },
  {
    id: 3,
    name: 'Pottery',
    amount: 0,
    value: 0,
  },
  {
    id: 4,
    name: 'Cloth',
    amount: 0,
    value: 0,
  },
  {
    id: 5,
    name: 'Spearheads',
    amount: 0,
    value: 0,
  },
];

const seedGoods = () => Goods.bulkCreate(goodsData);

module.exports = seedGoods;