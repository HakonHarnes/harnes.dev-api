const rateLimit = require('express-rate-limit');
const express = require('express')
const app = express()
const port = 3000


// JSON limiter
app.use(express.json({ limit: '10kb' }));

// Limiter middleware to prevent DOS-attacks
app.use('/api', rateLimit({
    max: 100,
    winowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP-address. Please try again in one hour.',
}));

// Logging middleware
app.use((req, res, next) => {
    console.log(`🟢 - ${req.method} [${req.originalUrl.toUpperCase()}] \n`);
    req.con = connection;
    next();
});

app.post('/api/email', (req, res) => {
    console.log('Send email');
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})