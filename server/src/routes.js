const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const DriverFeedbackController = require('./controllers/DriverFeedbackController')
const PassengerFeedbackController = require('./controllers/PassengerFeedbackController')
const PassengerCancelRequest = require('./controllers/PassengerCancelRequestController')
const DriverLocationController = require('./controllers/LocationController')
const HistoryController = require('./controllers/HistoryController')
const PriceController = require('./controllers/PriceController')
const CancellationRateController = require('./controllers/CancellationController')
const PickupsController = require('./controllers/PickupsController')

module.exports = (app) => {
    app.post('/savePickups', //middleway function to save driver's pickup history
        PickupsController.savePickups)

    app.post('/getPickups', //middleway function to get driver's pickup history
        PickupsController.getPickups)

    app.post('/getCancelRate', //middleway function to get driver's acceptance rate
        CancellationRateController.get)

    app.post('/postCancelRate', //middleway function to update driver's acceptance rate
        CancellationRateController.save)

    app.get('/index', //middleway function to get current fare
        PriceController.index)

    app.post('/post', //middleway function to update current fare
        PriceController.post)

    app.post('/register', //middleway function to authenticate //express middleware to check inputs before passing it to controller
        AuthenticationController.register)

    app.post('/login', //middleway function to authenticate user credentials
        AuthenticationController.login)

    app.post('/findDetails', //middleway function to find user details
        AuthenticationController.findDetails)

    app.post('/updateDetails', //middleway function to update user details
        AuthenticationController.updateDetails)

    app.post('/deleteDetails', //middleway function to delete user
        AuthenticationController.deleteDetails)

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

    app.post('/saveHistory', //middleway function to save history of completed ride
        HistoryController.saveHistory)
    
    app.post('/getHistory', //middleway function to save history of completed ride
        HistoryController.getHistory)
}