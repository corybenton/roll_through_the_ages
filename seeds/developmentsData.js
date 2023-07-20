const { Developments } = require('../models');

const developmentsData = [
  {
    id: 0,
    name: 'Leadership',
    cost: 10,
    points: 2,
    effect: 'Reroll 1 die (after last roll)'
  },
  {
    id: 1,
    name: 'Irrigation',
    cost: 10,
    points: 2,
    effect: '2 skulls has no effect',
  },
  {
    id: 2,
    name: 'Agriculture',
    cost: 15,
    points: 3,
    effect: '+1 food per food die',
  },
  {
    id: 3,
    name: 'Quarrying',
    cost: 15,
    points: 3,
    effect: '+1 stone if collecting stone',
  },
  {
    id: 4,
    name: 'Medicine',
    cost: 15,
    points: 3,
    effect: '3 skulls has no effect',
  },
  {
    id: 5,
    name: 'Coinage',
    cost: 20,
    points: 4,
    effect: 'coin die worth 12',
  },
  {
    id: 6,
    name: 'Caravans',
    cost: 20,
    points: 4,
    effect: 'do not need to discard goods',
  },
  {
    id: 7,
    name: 'Religion',
    cost: 20,
    points: 6,
    effect: '5+ skulls affects opponents',
  },
  {
    id: 8,
    name: 'Granaries',
    cost: 30,
    points: 6,
    effect: 'sell food for 4 coins each',
  },
  {
    id: 9,
    name: 'Masonry',
    cost: 30,
    points: 6,
    effect: '+1 worker per worker die',
  },
  {
    id: 10,
    name: 'Engineering',
    cost: 40,
    points: 6,
    effect: 'use stone for 3 workers each',
  },
  {
    id: 11,
    name: 'Architecture',
    cost: 50,
    points: 8,
    effect: '+1 point per monument',
  },
  {
    id: 12,
    name: 'Empire',
    cost: 60,
    points: 8,
    effect: '+1 point per city',
  },
];

const seedDevelopments = () => Developments.bulkCreate(developmentsData);

module.exports = seedDevelopments;