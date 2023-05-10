var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');


const arrToLower = (arr) => {
  return arr.map(element => {
    return element.toLowerCase().trim();
  });
}

const constructGetQuery = (tags, shows, characters, nsfw, porn, gender) => {
  let query = {};
  if (tags && tags!=='') {query['tags'] = {'$in': arrToLower(tags.split(','))};}
  if (shows && shows!=='') { query['shows'] = {'$in': arrToLower(shows.split(','))}; }
  if (characters && characters!=='') { query['characters'] = {'$in': arrToLower(characters.split(','))}; }
  if (gender && gender in ['male', 'female', 'other', 'none']) { query['gender'] = gender; }
  if (nsfw === 'false') { query['nsfw'] = false; }
  if (porn === 'false') { query['porn'] = false; }
  return query
}


router.get('/', function(req, res, next) {
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
  );
  console.log('query: ', query);
  const client = dbClient.getDatabase();
  const collection = client.collection('images');
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
      console.log(result);
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
