const RideHistory = require('../models/History');

module.exports = {
    async saveHistory(req, res) {
        const user = await RideHistory.findOne({
            email: req.body.email
        })
        //Check if passenger had a history. If not then create new history item
        if (!user) {
            RideHistory.create(req.body).then(function (info) {
                res.send({
                    saved: info,
                    message: `Successfully saved ride history`,
                })
            }).catch(next => {
                if (next.name == 'MongoError') {
                    res.status(400).send({
                        error: 'Error saving ride history'
                    })
                }
                console.log(next)
            }); //send back the object to client that res for the endpoint
        }
        //If email exist, find the corrent user and update its history
        else {
            try {
                const newHistory = await RideHistory.update({
                    'email': req.body.email
                }, {
                    $push: {
                        'rideInfo': req.body.rideInfo
                    }
                })
                res.send(newHistory)
            } catch (err) {
                console.log(err)
                res.status(500).send({
                    error: 'An error has occured trying to save new history'
                })
            }
        }
    },
    async getHistory(req,res) {
        try {
            const user = await RideHistory.findOne({
                email: req.body.email
            })
            if(user) {
                res.send({
                    histories: user,
                    message: 'Successfully retrieved ride history',
                    condition: true
                })
            }
            else {
                res.status(400).send({
                    error: 'User does not exist in the server',
                    condition: false
                })
            }         
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to fetch ride histories',
                condition: false
            })
        }
    },
}