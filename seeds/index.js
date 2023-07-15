const sequelize = require('../config/connection');
const seedGoods = require('./goodsData');
const seedDevelopments = require('./developmentsData');
const seedMonuments = require('./monumentsData');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedGoods();

  await seedDevelopments();

  await seedMonuments();

  process.exit(0);
};

seedAll();
