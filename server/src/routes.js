const AuthenticationController = require('./controllers/AuthenticationController')
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

module.exports = (app) => {
    app.post('/register', //middleway function to authenticate
        AuthenticationControllerPolicy.register, //express middleware to check inputs before passing it to controller
        AuthenticationController.register)

    app.post('/login', //middleway function to authenticate
        AuthenticationController.login)
}