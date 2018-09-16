const Price = require('../models/Price');

module.exports = {
    async index (req, res) {
        try {
            const price = await Price.findOne({
                _id: "5b9ebc65ee52860d3c8372e7"
            })
            res.send(price)
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to fetch the current fare rate'
            })
        }
    },
    async post (req, res) {
        try {
            const x = await Price.updateMany({},{$set: {price: req.body.price}}) //dont forget await when making promise call
            res.send(x)
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to update the current fare'
            })
        }
    }
}