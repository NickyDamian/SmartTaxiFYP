const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

const DriverLocationController = require('./controllers/LocationController')

module.exports = (app) => {
    app.post('/register', //middleway function to authenticate
        AuthenticationControllerPolicy.register, //express middleware to check inputs before passing it to controller
        AuthenticationController.register)

    app.post('/login', //middleway function to authenticate user credentials
        AuthenticationController.login)

    app.post('/location', //middleway function to save driver location
        DriverLocationController.saveLocation)

    app.get('/location', //middleway function to get all driver location
        DriverLocationController.getLocation)
}