const DriverLocation = require('../models/DriverLocation');

module.exports = {
    async saveLocation(req, res) {
        DriverLocation.create(req.body).then(function (location) {
            res.send({
                saved: location,
                message: `Successfully saved driver location`
            })
        }).catch(next => {
            if(next.name == 'MongoError'){
                res.status(400).send({error: 'Error Saving Driver Location'})
            }
            console.log(next)
        }); //send back the object to client that res for the endpoint
    },
    async getLocation(req,res) {
        try {
            const location = await DriverLocation.find().limit(10) //Send back only the first 10 searches
            res.send(location)
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to fetch the drivers location'
            })
        }
    },
}