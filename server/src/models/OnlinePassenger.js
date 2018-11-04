const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create online passenger Schema and Model
const onlinePassenger = new Schema({
    socketID:{
        type: String,
        required: [true, 'socketID is required'],
        unique: true
    }
});

const OnlinePassenger = mongoose.model('onlinePassenger', onlinePassenger);
module.exports = OnlinePassenger;