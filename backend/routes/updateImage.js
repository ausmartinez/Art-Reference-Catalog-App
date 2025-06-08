var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');

router.post('/', (req, res, next) => {
    const db = req.app.get('db'); 
    const collection = db.collection('images');
    collection.updateOne(
        {_id: ObjectId.createFromHexString(req.body.id)},
        {
            $set: {
                tags: req.body.tags,
                characters: req.body.characters,
                shows: req.body.shows,
                gender: req.body.gender,
                nsfw: Boolean(req.body.nsfw),
                porn: Boolean(req.body.porn),
            }
        }
    )
    .then(result => {
        res.json({message: 'Successfully upldated file'});

    })
    .catch(err => {
        res.json({erorr: err});
    });
});

module.exports = router;
