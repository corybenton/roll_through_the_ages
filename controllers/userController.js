const { User } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.checkPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.user_id = user.id;

    req.session.loggedIn = true;

    req.session.user_name = user.name;

    //console.log('userName-usercontrollerlogin: ', req.session.user_name);

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await User.create({ name: username, email, password });

    req.session.user_id = newUser.id;

    req.session.loggedIn = true;

    req.session.user_name = newUser.name;

    //console.log('userNameusercontrollersignup: ', req.session.user_name);

    res.json({ message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.sendStatus(204);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserData = async (req, res) => {
  const userId = req.session.user_id;
  console.log('userId getUserData User Controller outside try: ', userId);

  try {
    const userId = req.session.user_id;
    //console.log('userId getUserData User Controller: ', userId);

    const user = await User.findByPk(userId);
    //console.log('user getUserData User Controller: ', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  login,
  signup,
  logout,
  getUserData,
};