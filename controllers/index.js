const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
const { login, signup, logout } = require('./userController');

router.use('/', homeRoutes);

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

module.exports = router;
