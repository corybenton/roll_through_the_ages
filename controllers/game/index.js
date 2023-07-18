const router = require('express').Router();
const gameRoutes = require('./game-routes');

router.use('/', gameRoutes);

module.exports = router;