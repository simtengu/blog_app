const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authentication')
const {getUsers, updateUserDetails,getAuthUser } = require('../controllers/user');

router.get('/users', getUsers);
router.patch('/user/:id', updateUserDetails);
router.route('/user').get(getAuthUser);

module.exports = router;