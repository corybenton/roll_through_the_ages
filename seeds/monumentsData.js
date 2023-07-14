const { Monuments } = require('../models');

const monumentsData = [
  {
    name: 'Step Pyramid',
    needed: 3,
    pointsFirst: 1,
    pontsSecond: 0,
  },
  {
    name: 'Stone Circle',
    needed: 5,
    pointsFirst: 2,
    pontsSecond: 1,
  },
  {
    name: 'Hanging Gardens',
    needed: 11,
    pointsFirst: 8,
    pontsSecond: 4,
  },
  {
    name: 'Obelisk',
    needed: 9,
    pointsFirst: 6,
    pontsSecond: 3,
  },
  {
    name: 'Great Wall',
    needed: 13,
    pointsFirst: 10,
    pontsSecond: 5,
  },
];

const seedMonuments = () => Monuments.bulkCreate(monumentsData);

module.exports = seedMonuments;