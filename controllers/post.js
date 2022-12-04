const Post = require("../models/Post");
const User = require("../models/User");
const fs = require('fs');
const { populate } = require("../models/Post");
const getPosts = async (req, res) => {
    const { page } = req.query;
    const pageNumber = page ? page : 1;
    const limit = 16;
    const skip = (page - 1) * limit;
    const posts = await Post.find({}).populate("owner").sort('-createdAt');
    res.status(200).json({ posts })
}

const getSinglePost = async (req, res) => {

    const { postId } = req.params;
    try {
        const post = await Post.findById(postId).populate('owner');
        const posts = await Post.find({ _id: { $ne: postId }, category: post.category }).populate('owner').sort("-createdAt").limit(5)
        if (!post) {
            res.status(404).json({ message: "error.message" })
            return;
        }
        res.status(200).json({ post, relatedPosts: posts })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    try {

        const user = await User.findById(userId);
        const posts = await Post.find({ owner: userId })
        res.status(200).json({ posts,user })


    } catch (error) {
        res.status(400).json({ message: "something went wrong" })

    }

}

//fetch all users ............................... 
const getUsers = async (req, res) => {

    try {
        let users = await User.find({}).select("-createdAt");
        //   let getUserPosts = async ()=>{

        //   }

        // users.forEach(user => {
        //     let userPosts = await Post.find({ owner: user._id })
        //     user.postsCount = userPosts.length;
        // })

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong..." })
    }
}

const getFilteredPosts = async (req, res) => {
    const { category, tag } = req.query;

    let filterObject = {};

    if (category) {
        filterObject.category = category;
    }


    if (tag) {

        filterObject.tags = tag;
    }

    try {
        let posts = await Post.find(filterObject).populate("owner");
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })
    }


}

const savePost = async (req, res) => {

    try {
        const post = await Post.create(req.body);
        res.status(201).json({ post })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updatePost = async (req, res) => {

    const { postId } = req.params;
    try {
        const updatedPost = await Post.findOneAndUpdate({ _id: postId }, req.body, { returnDocument: "after" });
        if (!updatedPost) {

            res.status(404).json({ message: "the product you are trying to update wasn't found" })
        }
        res.status(200).json({ status: 'updated', post: updatedPost });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const msg = Object.values(err.errors)
                .map((item) => item.message)
                .join(',');

            res.status(400).json({ message: msg })
            return;
        }
        if (err.code && err.code === 11000) {
            const msg = `${Object.keys(
                err.keyValue
            )} entered has already been taken, please enter another one`
            res.status(400).json({ message: msg })
            return;
        }

        res.status(500).json({ message: err.message })

    }


}

const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findOne({ _id: postId })
        if (!post) {
            res.status(404).json({ message: "the post was not found" })
            return;
        }
        const images = post.images;
        //deleting post images................
        if (images.length > 0) {

            images.forEach(img => {
                let imgArray = img.split('/');
                let path = imgArray[imgArray.length - 1];

                fs.unlink(path, (err => {
                    if (err) { res.status(500).json({ message: err.message }); return; }
                }))

            });
        }
        //deleting the post............ 
        await Post.findOneAndRemove({ _id: postId })
        res.status(200).json({ status: 'deleted' })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteSingleImage = async (req, res) => {
    const { postId } = req.params;
    const { image } = req.body;
    // console.log(image);
    try {

        const post = await Post.findOne({ _id: postId })
        if (!post) {
            res.status(404).json({ message: "the post for the specified image was not found" })
            return;
        }
        const images = post.images;
        //deleting post image................
        if (images.length > 0) {

            let imgArray = image.split('/');
            let path = imgArray[imgArray.length - 1];

            fs.unlink(path, (err => {
                if (err) { throw err }
            }))

        }

        let newImagesList = images.filter(img => img !== image);

        //updating the product(rm deleted image)............ 
        await Post.findOneAndUpdate({ _id: postId }, { images: newImagesList }, { returnDocument: "after" })
        res.status(200).json({ status: 'image deleted' })


    } catch (error) {

        res.status(500).json({ message: error.message })
    }
}


const getTrendingPosts = async (req,res)=>{
    try {
        const posts = await Post.find({}).populate("owner").sort("-monthlyViews").limit(5);
         res.status(200).json({posts})
    } catch (error) {
        res.status(500).json({ message: error.message }) 
    }
}

const updateTrending = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        await Post.findByIdAndUpdate(postId, { monthlyViews: post.monthlyViews + 1 });
        let posts = await Post.find({}).populate("owner").sort("-monthlyViews").limit(5);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }


}

const searchPost = async (req, res) => {
    const { search } = req.query;

    let results = [];
    let posts = await Post.find({ $or: [{ title: { $regex: `.*${search}.*`, $options: 'i' } }, { category: { $regex: `.*${search}.*`, $options: 'i' } }] });

    if (posts.length > 0) {
        results = posts.filter((item, index) => {
            let postIndex = posts.findIndex(post => post._id === item._id);
            return postIndex === index;
        })

    } else {
        results = posts;
    }
    res.status(200).json({ posts: results });
}

const postComment = async (req, res) => {
    const { postId } = req.params;
    const updatedPost = await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: req.body } },{new:true})
    if(!updatedPost){
        res.status(404).json({message:"the post was not found"})
    }

    res.status(200).json({post:updatedPost})

}

const likePost = async (req, res) => {
    const { postId } = req.params;
    const updatedPost = await Post.findOneAndUpdate({ _id: postId }, { $push: { likes: req.body } }, { new: true })
    if (!updatedPost) {
        res.status(404).json({ message: "the post was not found" })
    }

    res.status(200).json({ post: updatedPost })

}

module.exports = {
    getPosts, getSinglePost, updatePost, savePost, getTrendingPosts, getUsers,
    deletePost, deleteSingleImage, updateTrending, searchPost, getUserPosts, getFilteredPosts, postComment,likePost
}