module.exports = {
    port: process.env.PORT || 8081,

    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    } //signing the jwt token with a secret string that is validated by the server
}
