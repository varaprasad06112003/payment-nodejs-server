const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Q5V3WBwumoaS32NDrrOKbnT7bF5CU3IAoFP9bAj2HVo36M3Y5krwwfx0fqjiril48MyaH5M2DFV403fQByoRG9B00WMIfRQFY"); // replace with your own secret key


const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', async(req, res) => {
    res.json({message: "Hello from nodejs server"});
})


app.post('/create-checkout-session', async(req, res) => {
    try {
        const { items } = req.body;
        const line_items = await items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            }
            ,quantity: item.quantity
        }));
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: "https://ezfoods.netlify.app/success",
            cancel_url: "https://ezfoods.netlify.app/cancel",
        });
        res.json({id: session.id});
    } catch(error){
        console.log(error);
    }
})

app.listen(3000, () => {
    console.log("server is running on port 3000");
})
