const { json } = require('express');
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const multer = require('multer')
const fs = require("fs")
const cloudinary = require("../utils/cloudinary")



//fetch auth user................. 
const getAuthUser = async (req, res) => {
    const user_id = req.user.userId;
    //authenticated user 
    try {
        const user = await User.findById(user_id).select('-password');
        if (!user) {
            res.status(404).json({ message: "user not found" })
            return;
        }

        res.status(200).json({ user });


    } catch (error) {
        res.status(500).json({ message: "something went wrong" })

    }
}

const updateUserDetails = async (req, res) => {
    //userid from  request params
    const { id } = req.params;
    //userid from  auth middleware
    const auth_user_id = req.user.userId;
    if (id !== auth_user_id) {
        res.status(403).json({ message: 'authentication error .. you can only update your details' })
        return;
    }
    const user = await User.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.status(200).json({ status: 'success', user });


}

const passwordUpdate = async (req, res) => {

    const { userId } = req.params;
    //userid from  auth middleware
    const auth_user_id = req.user.userId;
    if (userId !== auth_user_id) {
        res.status(403).json({ message: 'authentication error .. you can only update your details' })
        return;
    }

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);
    const user = await User.findOneAndUpdate({ _id: userId }, { password });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.status(200).json({ message: 'password changed' });

}

const updateUserImage = async (req, res) => {

    let { userId } = req.body;
    let user = await User.findById(userId);
    if (user.picture) {
        await cloudinary.uploader.destroy(user.picture_id)
    }
    const rs = await cloudinary.uploader.upload(req.file.path);
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { picture: rs.secure_url, picture_id: rs.public_id }, { new: true })
    res.status(200).json({ user: updatedUser });

}

const removeUserImage = async (req, res) => {
    const { userId } = req.body;
    let user = await User.findById(userId);
    if (user.picture) {
        let imgArray = user.picture.split('/');
        let path = imgArray[imgArray.length - 1];
        fs.unlink(path, (err => {
            if (err) { throw err }
        }))
    }
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { picture: "" }, { new: true })

    res.status(200).json({ user: updatedUser });

}







module.exports = {
    updateUserDetails, getAuthUser, updateUserImage, removeUserImage, passwordUpdate
}