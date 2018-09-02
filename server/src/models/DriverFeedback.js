const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create driverFeedback Schema and Model
const driverFeedbackSchema = new Schema({
    passengerID:{
        type: String,
        required: [true, 'passengerID is required'],
        unique: true
    },
    feedbacks:{
        rating: {type: String},
        comment: {type: String}
    }
});

const DriverFeedback = mongoose.model('driverFeedback', driverFeedbackSchema);
module.exports = DriverFeedback;