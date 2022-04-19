const mongoose = require('mongoose')

const connectDb = async (url) => {

  return  await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
}

module.exports = connectDb;