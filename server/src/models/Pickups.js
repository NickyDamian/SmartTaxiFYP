const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Pickups Schema and Model
const pickups = new Schema({
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true
    },
    pickup:[{
        location: {type: Object},
        price: {type: Number}
    }]
});

const Pickups = mongoose.model('pickups', pickups);
module.exports = Pickups;