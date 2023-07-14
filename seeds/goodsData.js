const { Goods } = require('../models');

const goodsData = [
  {
    name: 'Food',
    amount: 3,
    value: 3,
  },
  {
    name: 'Wood'
  },
  {
    name: 'Stone'
  },
  {
    name: 'Pottery'
  },
  {
    name: 'Cloth'
  },
  {
    name: 'Spearheads'
  },
];

const seedGoods = () => Goods.bulkCreate(goodsData);

module.exports = seedGoods;