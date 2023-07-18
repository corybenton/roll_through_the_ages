const router = require('express').Router();

const homeRoutes = require('./home-routes.js');

const { login, signup, logout, newGame } = require('./userController');

const gameRoutes = require('./game-routes.js');

router.use('/', homeRoutes);
router.use('/game', gameRoutes);

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.post('/game', newGame);

router.use('/game', gameRoutes);


module.exports = router;
