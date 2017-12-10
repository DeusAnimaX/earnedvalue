// Bring in our dependencies
const express = require('express');
const app = express();
const routes = require('./routes');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@127.0.0.1:27017/earnedvalue');

//  Connect all our routes to our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/',function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}, routes);
// Add headers


// Turn on that server!
app.listen(8080, () => {
  console.log('App listening on port 8080');
});
