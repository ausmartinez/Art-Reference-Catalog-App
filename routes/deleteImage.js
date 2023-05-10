var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');
const ObjectID = require('mongodb').ObjectID;
var fs = require('fs');


router.post('/', (req, res, next) => {
  console.log('deleting:', req.body);
  const client = dbClient.getDatabase();
  const collection = client.collection('images');
  collection.deleteOne(
    {_id: ObjectID(req.body._id)}
  )
  .then(result => {
    try {
      fs.unlinkSync('images/'+req.body.path)
      return {message: 'Successfully deleted file'};  
    } catch(err) {
      console.log('File could not be deleted.');
      console.error(err)
    }
  })
  .catch(err => {
    return {erorr: err};
  });
  res.redirect(req.get('referer'));
});


module.exports = router;
