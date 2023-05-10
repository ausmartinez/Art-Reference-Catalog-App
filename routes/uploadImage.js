var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, String(Date.now()) + path.extname(file.originalname))
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
  nsfw === 'on' ? imageObj['nsfw'] = true : imageObj['nsfw'] = false;
  porn === 'on' ? imageObj['porn'] = true : imageObj['porn'] = false;
  return imageObj;
};


const pushToDb = (object) => {
  const client = dbClient.getDatabase();
  const collection = client.collection('images');
  console.log(object);
  collection.insertOne(object)
  .then(result => {
    return {message: 'Successfully uploaded file'};
  })
  .catch(err => {
    return {erorr: err};
  });
};


router.post('/',
upload.single('photo'),
(req, res, next) => {
  pushToDb(constructObject(
    req.file.filename,
    req.body.uploadTags,
    req.body.uploadCharacters,
    req.body.uploadShows,
    req.body.uploadGender,
    req.body.uploadNsfw,
    req.body.uploadPorn,
  ));
  return res.redirect('/');
});


module.exports = router;
