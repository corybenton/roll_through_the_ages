const express = require('express');
const router = express.Router();
const { GameState, Monuments, Developments, Goods, User } = require('../models');


router.post('/game', async (req, res) => {
  console.log('New game request received:', req.body);
  try {
    console.log('User ID:', req.session.userId);
    const userId = req.session.userId;
    const newGameState = await GameState.create({ player: userId });
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
    const gameId = req.session.id;

    const gameData = await GameState.findByPk(gameId, {
      include: [
        { model: Monuments },
        { model: Developments },
        { model: Goods },
        { model: User },
      ],
    });

    if (!gameData) {
      return res.status(404).json({ error: 'Game state not found' });
    }

    // Render the 'game' handlebars template and pass the fetched data
    res.render('game', { game: gameData });
    //res.render('game');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/game', async (req, res) => {
  try{
    const gameId = req.session.userId;

    let data;
    if (req.body.place === 'learned') {
      data = await Developments.update({learned: req.body.value}, {
        where: {
          name: req.body.category,
          gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'needed') {
      data = await Monuments.update({needed: req.body.value}, {
        where: {
          name: req.body.category,
          gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'amount') {
      data = await Goods.update({amount: req.body.value}, {
        where: {
          name: req.body.category,
          gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'value') {
      data = await Goods.update({value: req.body.value}, {
        where: {
          name: req.body.category,
          gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'score') {
      data = await GameState.update({score: req.body.value}, {
        where: {
          gamestate_id: gameId,
        }
      });
    } else if (req.body.place === 'disasters') {
      data = await GameState.update({disasters: req.body.value}, {
        where: {
          gamestate_id: gameId,
        }
      });
    } else if (req.body.place === 'cities') {
      data = await GameState.update({cities: req.body.value}, {
        where: {
          gamestate_id: gameId,
        }
      });
    } else if (req.body.place === 'citiesNeed') {
      data = await GameState.update({citiesNeed: req.body.value}, {
        where: {
          gamestate_id: gameId,
        }
      });
    }
    if (data === 200){
      console.log('Yay!');
    }
    res.render('game');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
