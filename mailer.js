
const express = require("express")
const nodemailer = require('nodemailer')

const Mailgen = require('mailgen')


const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")

const {intro, outro} = require('./email-Intro-outro')

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(cors())
const port = 3001

app.post('/transaction', async(req, res)=> {
    

    const {amount, booking, name, email} = req.body
    

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: 'hospitality.in.space@gmail.com',
          pass: 'wdwnwdyrspbewzyb'
        },
        tls: {rejectUnauthorized: false }
    });

   

    let mailgenerator = new Mailgen({
        theme: 'salted',
        product: {
            name: 'Space Hospitality',
            link: 'https://mailgen.js'
        }
    })

    let emailContent = {
        body: {
            name: name.split(' ')[1],
            intro: 'Your Booking has been processed successfully.',
            table: {
                data: [
                    {
                        room: booking.name,
                        description: booking.description,
                        amount: `$${amount}`
                    },
                   
                ],
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        room: '10%',
                        amount: '5%'
                    },
                    // Optionally, change column text alignment
                    customAlignment: {
                        room: 'top',
                        amount: 'top'
                    }
                }
            },
            outro: 'We thank you for your booking.'
        }
    };

    let emailContent2 = {

        body: {
            name: name.split(' ')[1],
            intro,
            outro
        }

    }

    let mail = mailgenerator.generate(emailContent)
    let mail2 = mailgenerator.generate(emailContent2)

    let message = {
        from: 'hospitality.in.space@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Booking Receipt", // Subject line
        text: "Booking", // plain text body
        html: mail, // html body
    }

    let message2 = {
        from: 'hospitality.in.space@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Thank You for Choosing Space Hospitality!", // Subject line
        text: "Booking", // plain text body
        html: mail2, // html body
    }


    transporter.sendMail(message, (error, info)=> {
        if(error) return console.log(error)
        return res.status(201).json({
            msg: 'you should receive an email',
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        })
    })
    
    let timerId = setTimeout(() => {
        transporter.sendMail(message2, (error, info)=> {
            if(error) return console.log(error)
            return res.status(201).json({
                msg: 'you should receive an email',
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            })
        })

      clearTimeout(timerId)
        
    }, 2000);
})




app.listen(port, ()=> {console.log(`app is listening on ${port}`)})