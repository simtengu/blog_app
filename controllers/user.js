const { json } = require('express');
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const multer = require('multer')
const fs = require("fs")




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



//image related controllers.................................... 
//image setups.......... 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Math.round(Math.random() * 1000000) + file.originalname);
    }
})
const fileFilter = function (req, file, cb) {

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true)
    } else {
        cb(new Error("file type is invalid..(use .jpg, .png or .jpeg file) "))
    }



}
const uploadProfile = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 3 } });

const updateUserImage = async (req, res) => {

    let { userId } = req.body;
    let newImage = process.env.IMAGE_BASIC_PATH + req.file.path;
    let user = await User.findById(userId);
    if (user.picture) {
        let imgArray = user.picture.split('/');
        let path = imgArray[imgArray.length - 1];
        fs.unlink(path, (err => {
            if (err) { throw err }
        }))
    }

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { picture: newImage }, { new: true })
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
     updateUserDetails, getAuthUser, uploadProfile, updateUserImage, removeUserImage, passwordUpdate
}