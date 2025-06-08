const express = require('express');
const storage = require('node-persist');
const router = express.Router();


/* GET landing page. */
router.post('/', async (req, res, next) => {
    console.log(req.body);
    res.json({'test': 'result'});
});


module.exports = router;
