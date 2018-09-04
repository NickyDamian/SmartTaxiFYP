const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create PassengerFeedback Schema and Model
const passengerFeedbackSchema = new Schema({
    driverID:{
        type: String,
        required: [true, 'driverID is required'],
        unique: true
    },
    feedbacks:[{
        rating: {type: String},
        comment: {type: String}
    }]
});

const PassengerFeedback = mongoose.model('passengerFeedback', passengerFeedbackSchema);
module.exports = PassengerFeedback;