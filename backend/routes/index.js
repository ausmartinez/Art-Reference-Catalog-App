const express = require('express');
const storage = require('node-persist');
const router = express.Router();


/* GET landing page. */
router.get('/', function(req, res, next) {
    storage.getItem('formItem').then((result) => {
        console.log(result)
        res.render('index', {formItems: result});
    });
});


module.exports = router;
