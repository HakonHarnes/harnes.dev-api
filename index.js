const rateLimit = require('express-rate-limit');
const express = require('express');
const Email = require('./email');
const cors = require('cors');
const app = express()
const port = 3000

// Sets up dotenv
const dotenv = require('dotenv'); 
dotenv.config({ path: './.env' });

// JSON limiter
app.use(express.json({ limit: '10kb' }));

// Limiter middleware to prevent DOS-attacks
app.use('/api', rateLimit({
    max: 100,
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

app.get('/', (req, res) => {
    res.status(200).send('Harnes.dev'); 
})

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
        return res.status(400).send(); 
    }

    return res.status(200).send(); 
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})