const { Monuments } = require('../models');

const monumentsData = [
  {
    name: 'Step Pyramid',
    needed: 3,
    points_first: 1,
    points_second: 0,
  },
  {
    name: 'Stone Circle',
    needed: 5,
    points_first: 2,
    points_second: 1,
  },
  {
    name: 'Hanging Gardens',
    needed: 11,
    points_first: 8,
    points_second: 4,
  },
  {
    name: 'Obelisk',
    needed: 9,
    points_first: 6,
    points_second: 3,
  },
  {
    name: 'Great Wall',
    needed: 13,
    points_first: 10,
    points_second: 5,
  },
];

const seedMonuments = () => Monuments.bulkCreate(monumentsData);

module.exports = seedMonuments;