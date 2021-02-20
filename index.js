const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const multer = require('multer');

const app = express()
const PORT = 3333
app.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000 // file size in byte (10000000 = 10mb)
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

// file validation
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/; // images
    // const filetypes = /doc|txt|xlsx|docx/; // document
    // const filetypes = /7zip|gzip|rar|zip/; // images
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    // check if file extension is equal to mime type (file content)
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send({
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.send({
                    msg: 'Error: No File Selected!'
                });
            } else {
                res.send({
                    file : `http://localhost:${PORT}/static/uploads/${req.file.filename}`
                })
            }
        }
    });
});

app.use('/static', express.static('public')) // to render all static files inside (./public) directory and sub directory

app.listen(PORT, () => {
    console.log(`listing to port ${PORT}`);
})