const Cancellation = require('../models/CancelledRides');

module.exports = {
    async save(req, res) {
        const user = await Cancellation.findOne({
            email: req.body.email
        })
        //Check if driver exist. If not then create new driver item
        if (!user) {
            Cancellation.create(req.body).then(function (rate) {
                res.send({
                    driverRate: rate,
                    message: `Successfully save acceptance rate`
                })
            }).catch(next => {
                if(next.name == 'MongoError'){
                    res.status(400).send({error: 'Error saving acceptance rate'})
                }
                console.log(next)
            }); //send back the object to client that res for the endpoint
        }
        //If driver exist, find the corrent driver and update its location
        else {
            Cancellation.findOneAndUpdate(
                {email: req.body.email},
                {cancelled: req.body.cancelled,totalRides: req.body.totalRides}
            ).then(function(){
                Cancellation.findOne({
                    email: req.body.email
                }).then(function(rate){
                    res.send({
                        driverRate: rate,
                        message: `Successfully updated acceptance rate`
                    })
                }).catch(next => {
                    if(next.name == 'MongoError'){
                        res.status(400).send({error: 'Error retrieving new acceptance rate'})
                    }
                    console.log(next)
                })
            }).catch(next => {
                if(next.name == 'MongoError'){
                    res.status(400).send({error: 'Error updating acceptance rate'})
                }
                console.log(next)
            })
        }
        
    },
    async get(req,res) {
        try {
            const rate = await Cancellation.findOne({
                email: req.body.email
            }) //Send back only the first 10 searches
            res.send(rate)
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to fetch the drivers acceptance rate'
            })
        }
    },
}