const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
const { login, signup } = require('./userController');

router.use('/', homeRoutes);

router.post('/login', login);

router.post('/signup', signup);

module.exports = router;
