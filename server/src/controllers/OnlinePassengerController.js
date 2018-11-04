const OnlinePassenger = require('../models/OnlinePassenger');

module.exports = {
    async saveOnlinePassenger(req, res) {
        OnlinePassenger.create(req.body).then(function (usersOnline) {
                res.send({
                    saved: usersOnline,
                    message: `Successfully saved online user`
                })
            }).catch(next => {
                if(next.name == 'MongoError'){
                    res.status(400).send({error: 'Error saving Driver Location'})
                }
                console.log(next)
            }); //send back the object to client that res for the endpoint      
    },
    async deleteOnlinePassenger(req,res) {
        const {socketID} = req.body
        //remove driver from the available OnlinePassenger collection in mongodb
        await OnlinePassenger.remove({
            socketID: socketID
        }).then(
            res.send({
                message: "Online user has been removed from database"
            })
        ).catch(next => {
            if(next.name == 'MongoError'){
                res.status(400).send({error: 'Error deleting Online user'})
            }
            console.log(next)
        })
    },
    async getOnlinePassenger(req,res) {
        try {
            const onlinePassenger = await OnlinePassenger.find().limit(10) //Send back only the first 10 searches
            res.send(onlinePassenger)
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to fetch the Online users'
            })
        }
    },
}