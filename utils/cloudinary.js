const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: 'simtengu',
    api_key: '744721948639674',
    api_secret: 'ewhDQ5AZWske6n9NMbtAl_6NBo0'
});

module.exports = cloudinary