const Pickups = require('../models/Pickups');

module.exports = {
    async savePickups(req, res) {
        const user = await Pickups.findOne({
            email: req.body.email
        })
        //Check if driver had any Pickups. If not then create new Pickups item
        if (!user) {
            Pickups.create(req.body).then(function (info) {
                res.send({
                    saved: info,
                    message: `Successfully saved ride Pickups`,
                })
            }).catch(next => {
                if (next.name == 'MongoError') {
                    res.status(400).send({
                        error: 'Error saving ride Pickups'
                    })
                }
                console.log(next)
            }); //send back the object to client that res for the endpoint
        }
        //If email exist, find the corrent user and update its Pickups
        else {
            try {
                const newPickups = await Pickups.update({
                    'email': req.body.email
                }, {
                    $push: {
                        'pickup': req.body.pickup
                    }
                })
                res.send(newPickups)
            } catch (err) {
                console.log(err)
                res.status(500).send({
                    error: 'An error has occured trying to save new Pickups'
                })
            }
        }
    },
    async getPickups(req,res) {
        try {
            const user = await Pickups.findOne({
                email: req.body.email
            })
            if(user) {
                res.send({
                    details: user,
                    message: 'Successfully retrieved ride Pickups',
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
                error: 'Error has occured trying to fetch ride Pickups',
                condition: false
            })
        }
    },
}