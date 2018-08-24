const DriverLocation = require('../models/DriverLocation');

module.exports = {
    async saveLocation(req, res) {
        const {socketID, location} = req.body
        const driver = await DriverLocation.findOne({
            socketID: socketID
        })
        //Check if driver exist. If not then create new driver item
        if (!driver) {
            DriverLocation.create(req.body).then(function (location) {
                res.send({
                    saved: location,
                    message: `Successfully saved driver location`
                })
            }).catch(next => {
                if(next.name == 'MongoError'){
                    res.status(400).send({error: 'Error saving Driver Location'})
                }
                console.log(next)
            }); //send back the object to client that res for the endpoint
        }
        //If driver exist, find the corrent driver and update its location
        else {
            DriverLocation.findOneAndUpdate(
                {socketID: socketID},
                {location: location}
            ).then(function(){
                DriverLocation.findOne({
                    socketID: socketID
                }).then(function(driver){
                    res.send({
                        updatedLocation: driver,
                        message: `Successfully updated Driver Location`
                    })
                }).catch(next => {
                    if(next.name == 'MongoError'){
                        res.status(400).send({error: 'Error retrieving new Driver Location'})
                    }
                    console.log(next)
                })
            }).catch(next => {
                if(next.name == 'MongoError'){
                    res.status(400).send({error: 'Error updating Driver Location'})
                }
                console.log(next)
            })
        }
        
    },
    async deleteLocation(req,res) {
        const {socketID} = req.body
        console.log(socketID,"Kappppppaaaa    Priddeee")
        //remove driver from the available driver collection in mongodb
        await DriverLocation.remove({
            socketID: socketID
        }).then(
            res.send({
                message: "Driver has been removed from database"
            })
        ).catch(next => {
            if(next.name == 'MongoError'){
                res.status(400).send({error: 'Error deleting Driver Location'})
            }
            console.log(next)
        })
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