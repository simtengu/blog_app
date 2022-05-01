const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Math.round(Math.random() * 1000000) + file.originalname);
//     }
// })

const storage = multer.diskStorage({

})

const fileFilter = function (req, file, cb) {

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true)
    } else {
        cb(new Error("file type is invalid..(use .jpg, .png or .jpeg file) "), false)
    }



}
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 3 } });

module.exports =  upload 