const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
const gameRoutes = require('./game');
const { login, signup, logout } = require('./userController');

router.use('/', homeRoutes);
router.use('/game', gameRoutes);

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

module.exports = router;
