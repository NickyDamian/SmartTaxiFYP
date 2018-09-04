const express = require('express');
const bodyParser = require('body-parser'); //process JSON data
const cors = require('cors');
const morgan = require('morgan'); //Providing log files when server is running
const config = require('./config/config');
const mongoose = require('mongoose'); //Connect to MongoDb
const Promise = require('bluebird');
const socket = require('socket.io');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); //parse any JSON request that comes in
app.use(cors());//to allow any post from the client to access the server
                //we need cors if you want the server to be hosted on a different 
                //domain
                
require('./routes')(app);

//connect to mongoDB
mongoose.connect('mongodb://localhost/Smart-Taxi');
mongoose.Promise = Promise;

var server = app.listen(config.port);
console.log(`Server started on port ${config.port}`);

//Create socket setup/connection
var io = socket(server);

//listen for a 'connection' event from client to server
io.on('connection', function(socket) { //Each client will have their own socket
    console.log("Made socket connection");

    //function executes when socket "driver-location" message enters into the server
    socket.on('sendRequest', function(data){
        io.to(data.driverId).emit('sendRequest',data) //sending the data back to all other sockets on the client side that is listening to the "driver-location" message
    })

    //function executes when socket "driver-location" message enters into the server
    socket.on('requestStatusToAll', function(data){
        io.emit('requestStatusToAll',data) //sending a request to remove driver from passenger's marker array since driver is no longer available
    })

    //Send request status back to passenger if driver accepted or declined
    socket.on('requestStatus', function(data){
        io.to(data.passengerId).emit('requestStatus',data)
    })

    //Send location of selected driver and watch his position
    socket.on('sendTheSelectedDriverLocation', function(data){
        io.to(data.passengerId).emit('sendTheSelectedDriverLocation',data)
    })

    //Notify passenger that driver has reached
    socket.on('notifyDriverHasReached', function(data){
        io.to(data.passengerId).emit('notifyDriverHasReached',data)
    })

    //Notify passenger/driver that request has been canceled
    socket.on('canceledRequest', function(data){
        io.to(data.id).emit('canceledRequest',data)
    })

    //Passenger cannot cancel the booking once passenger in the driver's car
    socket.on('theJourneyHasBegun', function(data){
        io.to(data.passengerId).emit('theJourneyHasBegun',data)
    })

    //Passenger cannot click completed journey button unless the driver has reached the destination
    socket.on('rideActuallyCompleted', function(data){
        io.to(data.passengerId).emit('rideActuallyCompleted',data)
    })
});