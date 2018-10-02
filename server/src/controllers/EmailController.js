var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dondarudei@gmail.com',
    pass: 'kappapride123'
  }
})

module.exports = {
    async sendMail(req,res) {
        try {
        var mailOptions = {
            from: 'dondarudei@gmail.com',
            to: req.body.clientEmail,
            subject: 'E-receipt for your ride with Smart Taxi',
            html: '<div style="background-color: #212733; padding: 10px"><h1 style="color: white"> E-receipt </h1></div> <br>' +
              '<div style="font-family: sans-serif;padding: 1rem;justify-content: center;"> <div style="flex-direction: column; margin: auto; max-width: 35rem; display: flex;"><p style="align-self: flex-start; color: #000000"> Hi ' +
                req.body.clientName + ',<br><br> We at Smart Taxi would like to thank you for using our service.<br> Here the details of your receipt:<br><br><b>Name: ' + req.body.clientName +
                ' <br>Start Address: ' + req.body.startAddress + '<br>'+
                '<br>End Address: ' + req.body.endAddress + '<br>' +
                '<br>Price: ' + req.body.price +
                '<br><br></b> If you have any question regarding your receipt, you could always send us an email to talk to our customer support. <br><br> Regards,<br>Smart Taxi</p> ' +
                '</div></div>'
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              res.send('Email sent: ' + info.response);
            }
          });
        } catch (err) {
            res.status(500).send({
                error: 'Error has occured trying to send the e-receipt',
                condition: false
            })
        }
    },
}