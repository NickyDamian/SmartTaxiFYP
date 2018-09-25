const User = require('../models/User');
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function jwtSignUser(user) { //For Token
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    async register(req, res) {
        User.create(req.body).then(function (user) {
            res.send({
                saved: user,
                message: `Hello ${req.body.firstname} ${req.body.lastname}! Your user details has been registered!`
            })
        }).catch(next => {
            if (next.name == 'MongoError') {
                res.status(400).send({
                    error: 'This email account is already in use'
                })
            }
            console.log(next)
        }); //send back the object to client that res for the endpoint
    },
    async login(req, res) {
        try {
            const {
                email,
                password
            } = req.body
            const user = await User.findOne({
                email: email
            })
            if (!user) {
                res.status(403).send({
                    error: 'The email information was incorrect. Please try again.'
                })
            }
            user.comparePassword(password, function (err, isMatch) {
                if (err) throw err;
                if (!isMatch) {
                    res.status(403).send({
                        error: 'The password was incorrect. Please try again.'
                    })
                } else {
                    const userJson = user.toJSON()
                    res.send({
                        user: userJson,
                        token: jwtSignUser(userJson)
                    })
                }
            });
        } catch (error) {
            res.status(500).send({
                error: 'An error has occurred trying to log in. Please try again.'
            })
        } //send back the object to client that res for the endpoint
    },
    async findDetails(req, res) {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            if (!user) {
                res.status(403).send({
                    error: 'The email information was incorrect. Please try again.'
                })
            } else {
                res.send({
                    details: user,
                })
            }
        } catch (error) {
            res.status(500).send({
                error: 'An error has occurred trying to retrieve details. Please try again.'
            })
        } //send back the object to client that res for the endpoint
    },
    async updateDetails(req, res) {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            if (!user) {
                res.status(403).send({
                    error: 'User does not exist. Please try again.'
                })
            } else {
                await User.findOneAndUpdate({
                    email: req.body.email
                }, {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phonenumber: req.body.phonenumber,
                    dob: req.body.dob
                }).then(function () {
                    User.findOne({
                        email: req.body.email
                    }).then(function (user) {
                        res.send({
                            updatedDetails: user,
                            message: `Successfully updated user details`
                        })
                    }).catch(next => {
                        if (next.name == 'MongoError') {
                            res.status(400).send({
                                error: 'Error fetching updated user details'
                            })
                        }
                        console.log(next)
                    })
                }).catch(next => {
                    if (next.name == 'MongoError') {
                        res.status(400).send({
                            error: 'Error updating user details'
                        })
                    }
                    console.log(next)
                })
            }
        } catch (error) {
            res.status(500).send({
                error: 'An error has occurred trying to retrieve details. Please try again.'
            })
        } //send back the object to client that res for the endpoint
    },
    async deleteDetails(req,res) {
        //remove user from the collection in mongodb
        await User.remove({
            email: req.body.email
        }).then(
            res.send({
                message: "User has been removed from database"
            })
        ).catch(next => {
            if(next.name == 'MongoError'){
                res.status(400).send({error: 'Error deleting Driver Location'})
            }
            console.log(next)
        })
    }
}