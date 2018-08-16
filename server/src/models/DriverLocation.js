const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create driverLocation Schema and Model
const driverLocationSchema = new Schema({
    socketID:{
        type: String,
        required: [true, 'socketID is required'],
        unique: true
    },
    location:{
        type: Object,
        required: [true, 'location details is required']
    }
});

const DriverLocation = mongoose.model('driverLocation', driverLocationSchema);
module.exports = DriverLocation;