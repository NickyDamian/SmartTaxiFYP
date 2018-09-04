const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const DriverFeedbackController = require('./controllers/DriverFeedbackController')
const PassengerFeedbackController = require('./controllers/PassengerFeedbackController')
const PassengerCancelRequest = require('./controllers/PassengerCancelRequestController')
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
    
    app.post('/deletelocation', //middleway function to delete driver location 
        DriverLocationController.deleteLocation)

    app.post('/saveDriverFeedback', //middleway function to save driver's feedback on passengers
        DriverFeedbackController.saveDriverFeedback)

    app.post('/getDriverFeedbacks', //middleway function to get driver's feedback on passengers
        DriverFeedbackController.getDriverFeedbacks)
    
    app.post('/savePassengerFeedback', //middleway function to save Passenger's feedback on drivers
        PassengerFeedbackController.savePassengerFeedback)

    app.post('/getPassengerFeedbacks', //middleway function to get Passenger's feedback on drivers
        PassengerFeedbackController.getPassengerFeedbacks)
    
    app.post('/savePassengerCancelFeedback', //middleway function to save driver's feedback on canceled request
        PassengerCancelRequest.savePassengerCancelFeedback)

    app.post('/getPassengerCancelFeedbacks', //middleway function to save driver's feedback on canceled request
        PassengerCancelRequest.getPassengerCancelFeedbacks)
}