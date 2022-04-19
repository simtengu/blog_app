const User = require('../models/User')
const {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError
} = require('../errors');
//register user...............
const register = async (req, res) => {

  const userInfo = req.body;
    const newUser = await User.create(userInfo);
    const token =  newUser.createJWT();
    res.status(201).json({ status: 'success', user: newUser, token });

}
//log in ...................................................
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('please fill all required fields');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No user with given credentials was found');
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (isPasswordMatch) {
    const token =  user.createJWT();
    res.status(200).json({ status: 'success',user, token })
  } else {

    throw new BadRequestError('wrong email or password');
  }

}

module.exports = {
  login, register
}