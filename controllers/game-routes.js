const express = require('express');
const router = express.Router();
const { GameState, Monuments, Developments, Goods, User, Game } = require('../models');



// router.post('/game', async (req, res) => {
//   console.log('New game request received:', req.body);
//   try {
//     console.log('User ID:', req.session.user_id);
//     const userId = req.body.player;
//     const newGameState = await GameState.create({ 'player': userId });
//     console.log('gameroute post gamestate: ', newGameState);

//     res.redirect(`/game/${newGameState.id}`);
//     //res.redirect('/game');
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/game/:id', async (req, res) => {
//router.get('/game', async (req, res) => {
  try {
    const gameId = req.session.id;
    //const gameId = req.params.id;
    const gameData = await GameState.findByPk(gameId, {
    const gameId = req.params.id;
    console.log('gameId gameroutes: ', gameId);
    //instead of gamestate primary key, get all gamestates connected to this game.
    //if 2 gamestates connected to game, render handlebars, if its only 1, game waiting.
    const GameData = await Game.findByPk(gameId, {
      include: [
        {
          model: GameState,
          as: 'player1board'
        },
        {
          model: GameState,
          as: 'player2board'
        },
      ],
    });



    console.log('game data gameroutes: ', GameData);

    if (!GameData) {

      return res.status(404).json({ error: 'Game state not found' });
    }
    // Render the 'game' handlebars template and data

    //Avoids error in case of no player 2 data
    let player2data;


    // Render the 'game' handlebars template and pass the fetched data
    res.render('game', { game: gameData });

    if (!GameData.player2board) {
      player2data = null;
    } else {
      player2data = GameData.player2board.dataValues;
    }

    res.render('game', { gamestates: [GameData.player1board.dataValues, player2data] });
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
  
  const newGame = async (req, res) => {
  try {
    console.log('User ID:', req.session.user_id);
    const userId = req.session.user_id;
    const newGameState = await GameState.create({ player: userId });
    console.log('userController: ', newGameState);
    // res.status(201).json({ gameStateId: newGameState.id });
    console.log(newGameState);
    const board1 = newGameState.id;
    const newGame = await Game.create({ board1: board1 });
    res.status(201).json({ newgame: newGame.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/game', newGame);

module.exports = router;
