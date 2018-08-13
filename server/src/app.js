const express = require('express');
const bodyParser = require('body-parser'); //process JSON data
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const mongoose = require('mongoose');
const Promise = require('bluebird') 

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); //parse any JSON request that comes in
app.use(cors());//to allow any post from the client to access the server
                //we need cors if you want the server to be hosted on a different 
                //domain
                
require('./routes')(app);

//connect to mongoDB
mongoose.connect('mongodb://localhost/Smart-Taxi');
mongoose.Promise = Promise;

app.listen(config.port);
console.log(`Server started on port ${config.port}`);