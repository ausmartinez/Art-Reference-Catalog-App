const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dbClient = require('./dbClient');
const _config = require('./.config.js');
const storage = require('node-persist');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

// init the local storage
storage.init();

var app = express();

const client = new MongoClient(_config['dbUri'], {
    tlsCertificateKeyFile: _config['CRED_PATH'],
    serverApi: ServerApiVersion.v1,
});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    exposedHeaders: ["set-cookie"],
}
app.use(cors(corsOptions));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'images')));

// Routes
app.use('', require('./routes/index'));
app.use('/', require('./routes/index'));
app.use('/getImages', require('./routes/getImages'));
app.use('/uploadImage', require('./routes/uploadImage'));
app.use('/updateImage', require('./routes/updateImage'));
app.use('/deleteImage', require('./routes/deleteImage'));
app.use('/test', require('./routes/test'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({status: err});
});



const run = async () => {
    try{
        app.set('dbclient', client);
        await client.connect();
        const database = client.db(_config['dbName']);
        app.set('db', database);
        let port = 8080;
        app.listen(port, () => {
            console.log("App running on port:", port);
        });
    }
    catch (error) {
        console.error('Error Connecting:', error);
    }
}

run().catch(console.dir);


module.exports = app;
/* 
    dbClient.connectToDatabase((err, db) => {
        if (err) console.log(err);
        let port = 8080;
        app.listen(port, () => {
            console.log("App running on port:", port);
        });
    });
*/


    /*
    path          string
tags          array(strings)
characters    array(strings)
shows         array(strings)
gender        string
porn          boolean
nsfw          boolean
    */
