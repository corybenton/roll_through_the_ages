const { Developments } = require('../models');

const developmentsData = [
  {
    name: 'Leadership',
    cost: 10,
    points: 2,
    effect: 'Reroll 1 die (after last roll)',
  },
  {
    name: 'Irrigation',
    cost: 10,
    points: 2,
    effect: '2 skulls has no effect',
  },
  {
    name: 'Agriculture',
    cost: 15,
    points: 3,
    effect: '+1 food per food die',
  },
  {
    name: 'Quarrying',
    cost: 15,
    points: 3,
    effect: '+1 stone if collecting stone',
  },
  {
    name: 'Medicine',
    cost: 15,
    points: 3,
    effect: '3 skulls has no effect',
  },
  {
    name: 'Coinage',
    cost: 20,
    points: 4,
    effect: 'coin die worth 12',
  },
  {
    name: 'Caravans',
    cost: 20,
    points: 4,
    effect: 'do not need to discard goods',
  },
  {
    name: 'Religion',
    cost: 20,
    points: 6,
    effect: '5+ skulls affects opponents',
  },
  {
    name: 'Granaries',
    cost: 30,
    points: 6,
    effect: 'sell food for 4 coins each',
  },
  {
    name: 'Masonry',
    cost: 30,
    points: 6,
    effect: '+1 worker per worker die',
  },
  {
    name: 'Engineering',
    cost: 40,
    points: 6,
    effect: 'use stone for 3 workers each',
  },
  {
    name: 'Architecture',
    cost: 50,
    points: 8,
    effect: '+1 point per monument',
  },
  {
    name: 'Empire',
    cost: 60,
    points: 8,
    effect: '+1 point per city',
  },
];

const seedDevelopments = () => Developments.bulkCreate(developmentsData);

module.exports = seedDevelopments;