var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const ObjectID = require('mongodb').ObjectID;


const arrToLower = (arr) => {
  return arr.map(element => {
    return element.toLowerCase().trim();
  });
};


router.post('/', (req, res, next) => {
  console.log(req.body.uploadGender);
  const client = dbClient.getDatabase();
  const collection = client.collection('images');
  collection.updateOne(
    {_id: ObjectID(req.body.id)},
    {
      $set: {
        path: req.body.updatePath,
        tags: arrToLower(req.body.updateTags.split(',')),
        characters: arrToLower(req.body.updateCharacters.split(',')),
        shows: arrToLower(req.body.updateShows.split(',')),
        gender: req.body.updateGender,
        nsfw: Boolean(req.body.updateNsfw),
        porn: Boolean(req.body.updatePorn),
      }
    }
  )
  .then(result => {
    return {message: 'Successfully upldated file'};
  })
  .catch(err => {
    return {erorr: err};
  });
  res.redirect(req.get('referer'));
});


module.exports = router;
