const sequelize = require('../config/connection');
const seedGoods = require('./goodsData');
const seedDevelopments = require('./developmentData');
const seedMonuments = require('./monumentData');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedGoods();

  await seedDevelopments();

  await seedMonuments();

  process.exit(0);
};

seedAll();
