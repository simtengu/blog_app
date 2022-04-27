const express = require('express')
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post');
const { getPosts, getUserPosts, getFilteredPosts, getUsers, getSinglePost, updatePost, savePost, deletePost,postComment, deleteSingleImage, updateTrending, searchPost, likePost, getTrendingPosts } = require("../controllers/post");
const authenticationMiddleware = require('../middleware/authentication');

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
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 3 } });

router.post('/post_image/upload', upload.single('picture'), async (req, res) => {
    let { postId } = req.body;
    let newImg = process.env.IMAGE_BASIC_PATH + req.file.path;
    if (postId) {
        let post = await Post.findOne({ _id: postId })
        const images = post.images;
        let newImagesList = images.concat([newImg]);

        //updating the product(add image)............ 
        await Post.findOneAndUpdate({ _id: postId }, { images: newImagesList })
    }

    res.status(200).json({ path: newImg });

});

router.get("/posts", getPosts)
router.get("/posts/filtered", getFilteredPosts)
router.get("/posts/trending", getTrendingPosts)
router.get("/posts/:userId", getUserPosts)
router.route("/post/:postId")
    .get(getSinglePost)
    .patch(authenticationMiddleware, updatePost)
    .delete(authenticationMiddleware, deletePost)
router.post("/post", authenticationMiddleware,savePost);
router.patch("/post/image_delete/:postId", deleteSingleImage)
router.get("/post/update_trending/:postId", updateTrending)
router.get("/search_post", searchPost)
router.patch("/post/comment/:postId",authenticationMiddleware,postComment)
router.patch("/post/like/:postId",authenticationMiddleware,likePost)
router.get('/users', getUsers);

module.exports = router;
