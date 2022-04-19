const User = require('../models/User')
const {
   
    NotFoundError,
    UnAuthenticatedError
} = require('../errors');

//fetch all users ............................... 
const getUsers = async (req, res) => {
    const user_id = req.user.userId;
    //authenticated user 
    const user = await User.findById(user_id);

    if (!user.isAdmin === true) {
        throw new UnAuthenticatedError("Authorization error...the resource is only for admins")
    }

    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({ usersCount: users.length, users });
    } catch (error) {
        throw new Error('something went wrong....')
    }
}

//fetch auth user................. 
const getAuthUser = async (req, res) => {
    const user_id = req.user.userId;
    //authenticated user 
    try {
        const user = await User.findById(user_id).select('-password');
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({ user });


    } catch (error) {
        throw new Error("something went wrong")

    }
}

const updateUserDetails = async (req, res) => {
    //userid from  request params
    const { id } = req.params;
    //userid from  auth middleware
    const auth_user_id = req.user.userId;
    if (id !== auth_user_id) {
        throw new UnAuthenticatedError('authentication error .. you can only update your details')
    }
    

        const user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({ status: 'success', user });
        throw new Error("something went wrong")
    
}



module.exports = {
    getUsers, updateUserDetails, getAuthUser
}