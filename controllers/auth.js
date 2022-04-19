const User = require('../models/User')

//register user...............
const register = async (req, res) => {

  const userInfo = req.body;
  try {
    const newUser = await User.create(userInfo);
    const token =  newUser.createJWT();
    res.status(201).json({ status: 'success', user: newUser, token });
  } catch (error) {
    
    // let msg = Object.values(error["errors"]);
    //  let rs = msg.map(item=>item.message).join(',')
    res.status(500).json({message:error.message})
  }

}
//log in ...................................................
const login = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "user not found" })
      return;
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (isPasswordMatch) {
      const token =  user.createJWT();
      res.status(200).json({ status: 'success',user, token })
    } else {
      res.status(400).json({ message: "wrong email or password" })
      
    }
    
  } catch (error) {
    
    res.status(500).json({ message: "something went wrong" })
  }

}

module.exports = {
  login, register
}