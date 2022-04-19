const express = require('express')
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post');
const { getPosts, getUserPosts, getSinglePost, updatePost, savePost, deletePost, deleteSingleImage, updateTrending, searchPost } = require("../controllers/post");

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

router.post('/image/upload', upload.single('picha'), async (req, res) => {
    let { postId } = req.body;
    const post = await Post.findOne({ _id: postId })
    if (postId && post) {

        const images = product.images;
        let newImg = "http://localhost:5000/" + req.file.path;
        let newImagesList = images.concat([newImg]);

        //updating the product(add image)............ 
        await Post.findOneAndUpdate({ _id: postId }, { images: newImagesList })
    }

    res.status(200).json({ path: req.file.path });

});

router.get("/posts", getPosts)
router.get("/posts/filtered", getFilteredPosts)
router.get("/posts/:userId", getUserPosts)
router.route("/post/:postId").get(getSinglePost).patch(updatePost).delete(deletePost)
router.post("/post", savePost);
router.post("/post/image_delete/:postId",deleteSingleImage)
router.get("/post/update_trending/:postId",updateTrending)
router.get("/search_post",searchPost)

module.exports = router;