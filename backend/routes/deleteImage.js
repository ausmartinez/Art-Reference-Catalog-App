var express = require('express');
var router = express.Router();
const dbClient = require('./../dbClient');
const { ObjectId } = require('mongodb');
var fs = require('fs');


router.post('/', (req, res, next) => {
  console.log('deleting:', req.body);
  const db = req.app.get('db'); 
  const collection = db.collection('images');
  // if does not work, it doesn't go into the promise
  collection.deleteOne(
    {_id: new ObjectId(req.body._id)}
  )
  .then(result => {
      console.log(result);
    try {
      fs.unlinkSync('images/'+req.body.path)
      return {message: 'Successfully deleted file'};  
    } catch (err) {
      console.log('File could not be deleted.');
      console.error(err)
    }
  })
  .catch(err => {
    console.log(';lkjfdsasjdfkl;');
    return {erorr: err};
  });
  res.redirect(req.get('referer'));
});


module.exports = router;
