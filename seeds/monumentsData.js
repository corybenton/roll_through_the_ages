const { Monuments } = require('../models');

const monumentsData = require('../initialResources/monuments');

const seedMonuments = () => Monuments.bulkCreate(monumentsData);

module.exports = seedMonuments;