const router = require('express').Router();
const { User, GameState, Developments, Goods, Monuments } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const gameData1 = await GameState.findAll({
      where: player = req.body.id1,
      include: [{ model: Developments }, { model: Goods }, { model: Monuments },
        { model: User, attributes: ['name']}]
    });

    const gameData2 = await GameState.findAll({
      where: player = req.body.id2,
      include: [{ model: Developments }, { model: Goods }, { model: Monuments },
        { model: User, attributes: ['name']}]
    });

    //create dice

    res.render('game', (gameData1, gameData2));
  } catch (err) {
    res.status(500).json({ message: 'Internal server issue' });
  }
});

module.exports = router;