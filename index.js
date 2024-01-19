const express = require("express")

const app = express()
require('dotenv').config()
let p
const stripe = require("stripe")(process.env.REACT_SECRET_KEY)
const bodyParser = require("body-parser")
const cors = require('cors')

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(cors())

app.post('/', cors(), async (req, res)=> {
    try {

        const { amount } = req.body
       

        const paymentIntent = await stripe.paymentIntents.create(
            {
                amount,
                currency : 'usd',
                payment_method_types: ['card']

            }
        )

        

        



       

       res.json({
            message: 'payment successful',
            success: 'true',
            statusCode: 200,
            paymentIntent
            
       })

       

    }
    catch (error) {
        console.log(error)

        res.json({
    
            message: JSON.stringify(p),
            success: 'false',
            statusCode: 400
       })
    }
})

app.listen(process.env.port || 5000, ()=>{
    console.log("app is listening on port 5000")
    
})
