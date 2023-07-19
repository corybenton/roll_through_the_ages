const express = require('express');
const router = express.Router();
const { GameState, Monuments, Developments, Goods, User } = require('../models');


router.post('/game', async (req, res) => {
  console.log('New game request received:', req.body);
  try {
    console.log('User ID:', req.session.user_id);
    const userId = req.body.player;
    const newGameState = await GameState.create({ 'player': userId });
    console.log('gameroute post gamestate: ', newGameState);
    res.redirect(`/game/${newGameState.id}`);
    //res.redirect('/game');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/game/:id', async (req, res) => {
//router.get('/game', async (req, res) => {
  try {
    const gameId = req.params.id;

    const GameData = await GameState.findByPk(gameId, {
      include: [
        { model: Monuments },
        { model: Developments },
        { model: Goods },
        { model: User },
      ],
    });

    if (!GameData) {
      return res.status(404).json({ error: 'Game state not found' });
    }

    // Render the 'game' handlebars template and pass the fetched data
    res.render('game', { game: GameData });
    //res.render('game');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
