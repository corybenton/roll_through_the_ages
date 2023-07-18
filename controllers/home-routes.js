const router = require('express').Router();

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
    res.render('lobby', {
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Service Error');
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

router.get('/game', async (req, res) => {
  try {
    res.render('game', {
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Service Error');
  }
});

module.exports = router;