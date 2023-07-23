const router = require('express').Router();

const homeRoutes = require('./home-routes.js');

const { login, signup, logout, getUserData } = require('./userController');

const gameRoutes = require('./game-routes.js');

router.use('/', homeRoutes);

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.get('/api/user', getUserData);

router.use('/', gameRoutes);


module.exports = router;
