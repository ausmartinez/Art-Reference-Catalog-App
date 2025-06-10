var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');
const storage = require('node-persist');


const arrToLower = (arr) => {
    return arr.map(element => {
        return element.toLowerCase().trim();
    });
}

const constructGetQuery = (tags, shows, characters, nsfw, porn, gender, strict) => {
    let query = {};
    if (tags && tags!=='') {query['tags'] = {'$in': arrToLower(tags.split(','))};}
    if (shows && shows!=='') { query['shows'] = {'$in': arrToLower(shows.split(','))}; }
    if (characters && characters!=='') { query['characters'] = {'$in': arrToLower(characters.split(','))}; }
    if (['male', 'female', 'other', 'none'].includes(gender)) { query['gender'] = gender; }
    else if (gender == '') { query['gender'] = 'female'} // Default empty gender to female
    query['nsfw'] = nsfw==="true"?true:false;
    query['porn'] = porn==="true"?true:false;
    if (strict !== "true") {
        if (query['nsfw'])  {
            delete query['nsfw'];
        }
        if (query['porn']) {
            delete query['porn'];
        }
    }
    return query
}


router.get('/', (req, res, next) => {
    let lim = 500;
    if (req.query.amount!='NaN' && req.query.amount > 0) {
        lim = parseInt(req.query.amount);
    } else if (req.query.amount == 'NaN'){
        lim = 500;
    }
    const query = constructGetQuery(
        req.query.tags,
        req.query.shows,
        req.query.characters,
        req.query.nsfw,
        req.query.porn,
        req.query.gender,
        req.query.strict,
    );
    console.log('query: ', query);
    const db = req.app.get('db');
    const collection = db.collection('images');
    if (req.query.random == 'true') {
        collection.aggregate([
            {$match: query},
            {$sample: {size: (lim<=0?1:parseInt(lim))}},
            {$sort:{'_id':req.query.ascending=='true'?1:-1}}
        ])
            .toArray()
            .then(result => {
                result['_id'] = result['_id'] + ''
                res.setHeader('Content-Type', 'application/json');
                return res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                return res.json({err});
            });
    } else if (req.query.random == 'NaN' || req.query.random=='false') {
        collection.find(query)
            .limit(lim)
            .sort({'_id':req.query.ascending=='true'?1:-1})
            .toArray()
            .then(result => {
                result['_id'] = result['_id'] + ''
                res.setHeader('Content-Type', 'application/json');
                return res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                return res.json({err});
            });
    }
});

module.exports = router;
