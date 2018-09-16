const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create price Schema and Model
const priceSchema = new Schema({
    price:{type: Number}
});

const Price = mongoose.model('price', priceSchema);
module.exports = Price;