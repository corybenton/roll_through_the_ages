const express = require('express');
const router = express.Router();
const { GameState, Monuments, Developments, Goods, Game, User } = require('../models');

router.get('/game/:id', async (req, res) => {
  try {
    // const gameId = req.session.id;
    const gameId = req.params.id;
    //console.log('gameId gameroutes: ', gameId);
    //instead of gamestate primary key, get all gamestates connected to this game.
    //if 2 gamestates connected to game, render handlebars, if its only 1, game waiting.
    const GameData = await Game.findByPk(gameId, {
      include: [
        {
          model: GameState,
          as: 'player1board',
          include: [
            User,
            Monuments,
            Developments,
            Goods,
          ]
        },
        {
          model: GameState,
          as: 'player2board',
          include: [
            User,
            Monuments,
            Developments,
            Goods,
          ]
        },
      ],
    });
    //console.log(GameData);
    //console.log('gameData gameroutes: ', GameData);

    if (!GameData) {
      return res.status(404).json({ error: 'Game state not found' });
    }
    //Avoids error in case of no player 2 data
    let player2data;

    if (!GameData.player2board) {
      player2data = null;
    } else {
      player2data = GameData.player2board.dataValues;
    }

    let isMyTurn = false;
    const userId = req.session.user_id;
    //if true, I am player 1 of this game
    if (GameData.player1board.dataValues.player === userId) {
      if (GameData.turn === 1) {
        isMyTurn = true;
      }
    }
    if (GameData.player2board.dataValues.player === userId) {
      if (GameData.turn === 2) {
        isMyTurn = true;
      }
    }



    //console.log('p2Data gameroutes game:id : ', player2data);
    //console.log('GameData gameroutes game:id :', GameData);
    //console.log('GameData.player1board.dataValues, player2data gameroutes: ', GameData.player1board.dataValues, player2data);
    res.render('game', { gamestates: [GameData.player1board.dataValues, player2data], isMyTurn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/json/:id', async (req, res) => {
  try {
    // const gameId = req.session.id;
    const gameId = req.params.id;
    //console.log('gameId gameroutes json: ', gameId);
    //instead of gamestate primary key, get all gamestates connected to this game.
    //if 2 gamestates connected to game, render handlebars, if its only 1, game waiting.
    const GameData = await Game.findByPk(gameId, {
      include: [
        {
          model: GameState,
          as: 'player1board',
          include: [
            Monuments,
            Developments,
            Goods,
          ]
        },
        {
          model: GameState,
          as: 'player2board',
          include: [
            Monuments,
            Developments,
            Goods,
          ]
        },
      ],
    });

    //console.log('gameData gameroutes json: ', GameData);

    if (!GameData) {
      return res.status(404).json({ error: 'Game state not found' });
    }
    //Avoids error in case of no player 2 data
    let player2data;

    if (!GameData.player2board) {
      player2data = null;
    } else {
      player2data = GameData.player2board.dataValues;
    }
    //console.log('p2Data gameroutes json : ', player2data);
    //console.log('GameData gameroutes json :', GameData);

    res.json({ gamestates: [GameData.player1board.dataValues, player2data] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function createInitialResources(gamestate_id) {

  const listOfInitialMonuments = require('../initialResources/monuments');
  //console.log('listofinitialmonuments', listOfInitialMonuments);

  for (let i = 0; i < listOfInitialMonuments.length; i++) {
    let monument = listOfInitialMonuments[i];
    monument.gamestate_id = gamestate_id;
    //const initMonument = await Monuments.create(monument);
    await Monuments.create(monument);
  }


  const listOfInitialDevelopments = require('../initialResources/developments');
  //console.log('listofinitialDevlopments',listOfInitialDevelopments);

  for (let i = 0; i < listOfInitialDevelopments.length; i++) {
    let development = listOfInitialDevelopments[i];
    development.gamestate_id = gamestate_id;
    //const initDevelopment = await Developments.create(development);
    await Developments.create(development);
  }

  const listOfInitialGoods = require('../initialResources/goods');
  //console.log('listofinitialgoods', listOfInitialGoods);

  for (let i = 0; i < listOfInitialGoods.length; i++) {
    let goods = listOfInitialGoods[i];
    goods.gamestate_id = gamestate_id;
    //const initGoods = await Goods.create(good);
    await Goods.create(goods);
    //console.log('goods: ', goods);
  }
}


const newGame = async (req, res) => {
  try {
    //console.log('User ID:', req.session.user_id);
    const userId = req.session.user_id;
    const newGameState = await GameState.create({ player: userId });

    const board1 = newGameState.id;
    const newGame = await Game.create({ board1: board1 });
    await createInitialResources(newGameState.id);
    res.status(201).json({ newgame: newGame.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/game', newGame);

//Add second player
const joinGame = async (req, res) => {
  try {
    //console.log('User ID Join Game:', req.session.user_id);

    const userId = req.session.user_id;
    const newGameState = await GameState.create({ player: userId });
    const existingGame = await Game.findOne({ where: { board2: null } });
    if (existingGame) {
      await existingGame.update({ board2: newGameState.id });
      await createInitialResources(newGameState.id);
      res.status(201).json({ newgame: existingGame.id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
router.post('/join', joinGame);


router.put('/game', async (req, res) => {
  try{
    // const gameId = req.session.userId;

    if (req.body.place === 'learned') {
      await Developments.update({learned: req.body.value}, {
        where: {
          name: req.body.category,
          // gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'needed') {
      await Monuments.update({needed: req.body.value}, {
        where: {
          name: req.body.category,
          // gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'amount') {
      await Goods.update({amount: req.body.value}, {
        where: {
          name: req.body.category,
          // gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'value') {
      await Goods.update({value: req.body.value}, {
        where: {
          name: req.body.category,
          // gamestate_id: gameId,
        },
      });
    } else if (req.body.place === 'score') {
      await GameState.update({score: req.body.value}, {
        where: {
          // gamestate_id: gameId,
        }
      });
    } else if (req.body.place === 'disasters') {
      await GameState.update({disasters: req.body.value}, {
        where: {
          // gamestate_id: gameId,
        }
      });
    } else if (req.body.place === 'cities') {
      await GameState.update({cities: req.body.value}, {
        where: {
          // gamestate_id: gameId,
        }
      });
    } else if (req.body.place === 'citiesNeed') {
      await GameState.update({citiesNeed: req.body.value}, {
        where: {
          // gamestate_id: gameId,
        }
      });
    }

    res.status(200).render('game');
  } catch (err) {
    console.log(err);
  }
});

router.post('/game/:id/turnover', async (req, res) => {
  try {

    const gameId = req.params.id;
    const game = await Game.findByPk(gameId);

    console.log(game);
    console.log('!!!!!!!!!!! INSIDE GAME/ID/TURNOVER');

    let nextTurn;

    if (game.turn === 1) {
      nextTurn = 2;
    } else {
      nextTurn = 1;
    }

    await Game.update({ turn: nextTurn }, {
      where: {
        id: gameId
      }
    });



  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
