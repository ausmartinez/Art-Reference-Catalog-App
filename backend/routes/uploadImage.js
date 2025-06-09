var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            cb(null, 'E:/EMUL/refdb/frontend/public/images/');
        } catch (error) {
            console.log(error);
        }
    },
    filename: (req, file, cb) => {
        try {
            cb(null, String(Date.now()) + path.extname(file.originalname))
        } catch (error) {
            console.log(error);
        }
    }
});

const upload = multer({ storage: storage });


const arrToLower = (arr) => {
    return arr.map(element => {
        return element.toLowerCase().trim();
    });
}


const constructObject = (path, tags, characters, shows, gender, nsfw, porn) => {
    imageObj = {}
    imageObj['path'] = path;
    tags === "" ? imageObj['tags'] = [] : imageObj['tags'] = arrToLower(tags.split(','));
    characters === "" ? imageObj['characters'] = [] : imageObj['characters'] = arrToLower(characters.split(','));
    shows === "" ? imageObj['shows'] = [] : imageObj['shows'] = arrToLower(shows.split(','));
    imageObj['gender'] = gender.toLowerCase();
    imageObj['nsfw'] = nsfw==="true"?true:false;
    imageObj['porn'] = porn==="true"?true:false;
    return imageObj;
};


const pushToDb = (object, db, res) => {
    const collection = db.collection('images');
    console.log(object);
    collection.insertOne(object)
        .then(result => {
            res.json({message: 'Successfully uploaded file'});
        })
        .catch(err => {
            res.json({erorr: err});
        });
};


router.post('/', upload.single('photo'), (req, res, next) => {
    console.log(req.body);
    try {
        pushToDb(constructObject(
            req.file.filename,
            req.body.tags,
            req.body.characters,
            req.body.shows,
            req.body.gender,
            req.body.nsfw,
            req.body.porn,
        ), req.app.get('db'), res);   
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
