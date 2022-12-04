const express = require('express')
const router = express.Router();
const Post = require('../models/Post');
const { getPosts, getUserPosts, getFilteredPosts, getUsers, getSinglePost, updatePost, savePost, deletePost, postComment, deleteSingleImage, updateTrending, searchPost, likePost, getTrendingPosts } = require("../controllers/post");
const authenticationMiddleware = require('../middleware/authentication');
const upload = require("../utils/multer")
const cloudinary = require("../utils/cloudinary")


router.post('/post_image/upload', upload.single('picture'), async (req, res) => {
    let { postId } = req.body;

    const rs = await cloudinary.uploader.upload(req.file.path);
    const newImg = {
        image: rs.secure_url,
        image_id: rs.public_id
    }
    if (postId) {
        //updating the product(add image)............ 
        await Post.findOneAndUpdate({ _id: postId }, { $push: { images: newImg } })
    }


    res.status(200).json({ image: newImg });

});

router.get("/posts", getPosts)
router.get("/posts/filtered", getFilteredPosts)
router.get("/posts/trending", getTrendingPosts)
router.get("/posts/:userId", getUserPosts)
router.route("/post/:postId")
    .get(getSinglePost)
    .patch(authenticationMiddleware, updatePost)
    .delete(authenticationMiddleware, deletePost)
router.post("/post", authenticationMiddleware, savePost);
router.patch("/post/image_delete/:postId", deleteSingleImage)
router.get("/post/update_trending/:postId", updateTrending)
router.get("/search_post", searchPost)
router.patch("/post/comment/:postId", authenticationMiddleware, postComment)
router.patch("/post/like/:postId", authenticationMiddleware, likePost)
router.get('/users', getUsers);

module.exports = router;
