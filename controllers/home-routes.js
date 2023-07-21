const router = require('express').Router();
const { Game, GameState, User } = require('../models');

router.get('/', async (req, res) => {
  try {
    res.render('homepage', {
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Service Error');
  }
});

router.get('/login', (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('login');
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Service Error');
  }
});

router.get('/lobby', async (req, res) => {
  try {

    const allGames = await Game.findAll({
      include: [
        {
          model: GameState,
          as: 'player1board',
          include: [
            User
          ],
        },
        {
          model: GameState,
          as: 'player2board',
          include: [
            User
          ],
        },
      ],
    });

    const userName = req.session.user_name;
    //console.log('userHome-route:', userName);

    res.render('lobby', {
      loggedIn: req.session.loggedIn,
      games: allGames,
      user: userName
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/copyright', async (req, res) => {
  try {
    res.render('copyright', {
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Service Error');
  }
});

module.exports = router;
