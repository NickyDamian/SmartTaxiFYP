const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create PassengerCancelRequest Schema and Model
const passengerCancelRequestSchema = new Schema({
    passengerID:{
        type: String,
        required: [true, 'passengerID is required'],
        unique: true
    },
    feedbacks:[{
        driverName: {type: String},
        comment: {type: String}
    }]
});

const PassengerCancelRequest = mongoose.model('passengerCancelRequest', passengerCancelRequestSchema);
module.exports = PassengerCancelRequest;