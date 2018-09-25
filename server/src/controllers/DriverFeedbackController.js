const DriverFeedback = require('../models/DriverFeedback');

module.exports = {
    async saveDriverFeedback(req, res) {
        const {passengerID} = req.body
        const review = await DriverFeedback.findOne({
            passengerID: passengerID
        })
        //Check if passenger had a feedback before. If not then create new driver item
        if (!review) {
            DriverFeedback.create(req.body).then(function (comments) {
                res.send({
                    saved: comments,
                    message: `Successfully saved driver's feedback on passenger`,
                })
            }).catch(next => {
                if (next.name == 'MongoError') {
                    res.status(400).send({
                        error: 'Error saving drivers feedback on passenger'
                    })
                }
                console.log(next) 
            }); //send back the object to client that res for the endpoint
        }
        //If passenger feedback exist, find the corrent driver and update its location
        else {
            try {
                const driverFeedback = await DriverFeedback.update({
                    'passengerID': passengerID
                }, {
                    $push: {
                        'feedbacks': req.body.feedbacks
                    }
                })
                res.send(driverFeedback)
            } catch (err) {
                console.log(err)
                res.status(500).send({
                    error: 'An error has occured trying to save drivers feedback on passenger'
                })
            }
        }
    },
    async getDriverFeedbacks(req,res) {
        try {
            const feedback = await DriverFeedback.findOne({
                passengerID: req.body.passengerID
            })
            if(feedback) {
                res.send({
                    retrieved: feedback,
                    message: 'Successfully retrieved driver feedbacks',
                    condition: true
                })
            }
            else {
                res.status(400).send({
                    error: 'Passenger does not exist in the server',
                    condition: false
                })
            }         
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to fetch the drivers location',
                condition: false
            })
        }
    },
}