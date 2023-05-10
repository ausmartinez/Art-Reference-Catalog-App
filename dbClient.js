const MongoClient = require('mongodb').MongoClient;
const _config = require('./.config.js');

const CONNECTION_URL = _config['dbUri'];
const DATABASE_NAME = _config['dbName'];

let _db;

module.exports = {
  connectToDatabase: (callback) => {
    MongoClient.connect(CONNECTION_URL, {
      useNewUrlParser: true,
    }, (err, client) => {
      if (err) {
        console.log('******************ERROR IN DBCLIENT: ', err);
      }
      _db = client.db(DATABASE_NAME);
      return callback(err);
    });
  },
  getDatabase: () => {
    return _db;
  }
};
