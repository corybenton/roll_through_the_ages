const express = require('express');
const router = express.Router();
const { GameState, Monuments, Developments, Goods, Game, User } = require('../models');
const sequelize = require('../config/connection');

router.get('/game/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
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

    if (player2data && GameData.player2board.dataValues.player === userId) {
      if (GameData.turn === 2) {
        isMyTurn = true;
      }
    }

    GameData.player1board.dataValues.goods.sort((a, b) => {
      const numA = parseInt(a.number.replace('good', ''));
      const numB = parseInt(b.number.replace('good', ''));

      return numA - numB;
    });

    if (player2data) {
      GameData.player2board.dataValues.goods.sort((a, b) => {
        const numA = parseInt(a.number.replace('good', ''));
        const numB = parseInt(b.number.replace('good', ''));

        return numA - numB;
      });
    }

    let usersGameStateId;

    if (GameData.player1board.dataValues.player === userId) {
      usersGameStateId = GameData.player1board.dataValues.id;
    }

    if (player2data && GameData.player2board.dataValues.player === userId) {
      usersGameStateId = GameData.player2board.dataValues.id;
    }

    //console.log(usersGameStateId, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    res.render('game', { gamestates: [GameData.player1board.dataValues, player2data], isMyTurn, usersGameStateId, gameId, userId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/json/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
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

    let isMyTurn = false;
    const userId = req.session.user_id;
    //if true, I am player 1 of this game
    if (GameData.player1board.dataValues.player === userId) {
      if (GameData.turn === 1) {
        isMyTurn = true;
      }
    }
    if (player2data && GameData.player2board.dataValues.player === userId) {
      if (GameData.turn === 2) {
        isMyTurn = true;
      }
    }

    res.json({ gamestates: [GameData.player1board.dataValues, player2data], isMyTurn });
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

    await newGameState.update({ game_id: newGame.id });

    await createInitialResources(newGameState.id);
    res.status(201).json({ newgame: newGame.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/game', newGame);

const joinGame = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const gameId = req.body.gameId;

    const newGameState = await GameState.create({ player: userId, game_id: gameId });
    const existingGame = await Game.findOne({ where: { id: gameId, board2: null } });

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



router.put('/gameState/:UsersGameStateId', async (req, res) => {
  try {
    const currGSid = req.params.UsersGameStateId;
    console.log(currGSid, '????????????????????????????????????????????????????????');

    // const gameId = req.session.userId;
    // console.log(req.session);

    if (req.body.place === 'learned') {
      await Developments.update({learned: req.body.value}, {
        where: {
          name: req.body.category,
          gamestate_id: currGSid,
        },
      });
    } else if (req.body.place === 'needed') {
      await Monuments.update({needed: req.body.value}, {
        where: {
          number: req.body.category,
          gamestate_id: currGSid,
        },
      });
    } else if (req.body.place === 'amount') {
      await Goods.update({amount: req.body.value}, {
        where: {
          name: req.body.category,
          gamestate_id: currGSid,
        },
      });
    } else if (req.body.place === 'value') {
      await Goods.update({value: req.body.value}, {
        where: {
          name: req.body.category,
          gamestate_id: currGSid,
        },
      });
    } else if (req.body.place === 'score') {
      await GameState.update({score: req.body.value}, {
        where: {
          id: currGSid,
        }
      });
    } else if (req.body.place === 'disasters') {
      await GameState.update({disasters: req.body.value}, {
        where: {
          id: currGSid,
        }
      });
    } else if (req.body.place === 'cities') {
      await GameState.update({cities: req.body.value}, {
        where: {
          id: currGSid,
        }
      });
    } else if (req.body.place === 'citiesNeed') {
      await GameState.update({citiesNeed: req.body.value}, {
        where: {
          id: currGSid,
        }
      });
    }
    res.status(200).json('Success');
    console.log(`${req.body.place} updated to ${req.body.value}`);
    //res.status(200).render('game');
  } catch (err) {
    console.log(err);
  }
});

router.post('/game/:id/turnover', async (req, res) => {
  try {

    const gameId = req.params.id;
    const game = await Game.findByPk(gameId);

    //console.log(game);
    //console.log('!!!!!!!!!!! INSIDE GAME/ID/TURNOVER');

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

router.delete('/delete/game/:id', async (req, res) => {
  try {
    const gameId = req.params.id;

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    const gameStates = await GameState.findAll({ where: { game_id: gameId } });

    for (const gameState of gameStates) {
      const gameStateId = gameState.id;

      await Developments.destroy({ where: { gamestate_id: gameStateId } });
      await Monuments.destroy({ where: { gamestate_id: gameStateId } });
      await Goods.destroy({ where: { gamestate_id: gameStateId } });
      await GameState.destroy({ where: { game_id: gameId } });
    }

    await Game.destroy({ where: { id: gameId } });

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/game/:id/getTurn', async (req, res) => {
  try {

    const gameId = req.params.id;
    const game = await Game.findByPk(gameId);
    res.json(game.turn);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
