const { Developments } = require('../models');

const developmentsData = require('../initialResources/developments');

const seedDevelopments = () => Developments.bulkCreate(developmentsData);

module.exports = seedDevelopments;