const { array } = require('joi');
const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please provide post title'],
        minlength: 3,
    },
    body: {
        type: String,
        required: [true, "Please provide post body"],
        minlength: 10
    },
    category: { type: String },
    tags: {
        type: [String],
        default:[]

    },
    likes: {
        type: [],
        default: []

    },
    comments: {
        type: [],
        default: []

    },
    monthlyViews:{
        type: Number,
        default:0
    },
    images:{
        type:[String],
        required:[true,'provide atleast one image for the post']
    }

}, { timestamps: true });


module.exports = mongoose.model('Post', postSchema)