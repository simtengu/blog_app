const express = require('express')
const router = express.Router();
const { getUsers, updateUserDetails,passwordUpdate, getAuthUser, updateUserImage, uploadProfile, removeUserImage } = require('../controllers/user');


router.patch('/user/:id', updateUserDetails);
router.patch('/password_update/:userId', passwordUpdate);
router.patch('/update_picture', uploadProfile.single('picture'), updateUserImage);
router.patch('/user/remove_picture', removeUserImage);
router.route('/user').get(getAuthUser);

module.exports = router;