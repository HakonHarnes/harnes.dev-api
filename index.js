const rateLimit = require('express-rate-limit');
const express = require('express');
const Email = require('./email');
const cors = require('cors');
const app = express()

// Sets up dotenv
const dotenv = require('dotenv'); 
dotenv.config({ path: './.env' });

// JSON limiter
app.use(express.json({ limit: '10kb' }));

// Limiter middleware to prevent DOS-attacks (only 10 emails per hour)
app.use('/api', rateLimit({
    max: 10,
    winowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP-address. Please try again in one hour.',
}));

// Cors middleware
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`🟢 - ${req.method} [${req.originalUrl.toUpperCase()}] \n`);
    next();
});

// End-point for sending email 
app.post('/api/email', async (req, res) => {
    let { name, email, message } = req.body.data;

    // Sanitizes input 
    name = name.substring(0, 50); 
    email = email.substring(0, 50); 
    message = message.substring(0, 255); 

    // Sends email 
    try {
        await new Email(name, email, message).send(); 
    } catch(error) {
        console.log(error);
        return res.status(400).send(); 
    }

    return res.status(200).send(); 
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening at http://localhost:${process.env.PORT || 5000}`)
})