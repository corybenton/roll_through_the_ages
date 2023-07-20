const router = require('express').Router();

const homeRoutes = require('./home-routes.js');

const { login, signup, logout } = require('./userController');

const gameRoutes = require('./game-routes.js');

router.use('/', homeRoutes);

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.use('/', gameRoutes);


module.exports = router;
