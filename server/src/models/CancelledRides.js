const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create History Schema and Model
const cancellation = new Schema({
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    cancelled:{type: Number},
    totalRides:{type: Number}
});

const Cancellation = mongoose.model('cancellation', cancellation);
module.exports = Cancellation;