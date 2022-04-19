const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bcryptjs = require('bcryptjs');
const { number } = require('joi');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        maxlength: 20,
        minlength: 3,
    },
    lastName: {
        type: String,
        required: [true, "Please provide last name"],
        maxlength: 20,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    isAdmin: { type: Boolean, default: false },
    phone: {
        type: String,
        required: false,
        minlength: 10

    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 4,
    },
    resetCodes: {
        type: Number
    }

}, { timestamps: true });

//hashing password ........... 
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('updateOne', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;

}

userSchema.methods.getFullName = async function () {
    return await this.firstName + " " + this.lastName;
}

userSchema.methods.createJWT =  function () {
    const name =  this.firstName;
   
    return jwt.sign({ userId: this._id, name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

module.exports = mongoose.model('User', userSchema)