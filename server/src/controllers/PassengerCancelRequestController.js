const PassengerCancelRequest = require('../models/PassengerCancelRequest');

module.exports = { 
    async savePassengerCancelFeedback(req, res) {
        console.log(req.body.feedbacks, "Don Gaiiiiiiiiiiiiiiiiiiiiiiiiii", req.body.passengerID)
        const cancel = await PassengerCancelRequest.findOne({
            passengerID: req.body.passengerID
        })
        //Check if driver had a feedback before. If not then create new passenger item
        if (!cancel) {
            PassengerCancelRequest.create(req.body).then(function (comments) {
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
        //If driver feedback exist, find the corrent passenger and update its location
        else {
            try {
                const passengerFeedback = await PassengerCancelRequest.update({
                    'passengerID': req.body.passengerID
                }, {
                    $push: {
                        'feedbacks': req.body.feedbacks
                    }
                })
                res.send(passengerFeedback)
            } catch (err) {
                console.log(err)
                res.status(500).send({
                    error: 'An error has occured trying to save drivers feedback on passenger'
                })
            }
        }
    },
    async getPassengerCancelFeedbacks(req,res) {
        try {
            const feedback = await PassengerCancelRequest.findOne({
                passengerID: req.body.passengerID
            })
            if(feedback) {
                res.send({
                    feedbacks: feedback,
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
    }
}