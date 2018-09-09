const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create History Schema and Model
const history = new Schema({
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    rideInfo:[{
        startAddress: {type: String},
        endAddress: {type: String},
        rating: {type: String},
        feedback: {type: String},
        price: {type: String}
    }]
});

const History = mongoose.model('history', history);
module.exports = History;