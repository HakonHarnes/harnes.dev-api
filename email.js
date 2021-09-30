const nodemailer = require('nodemailer'); 

// Class for sending emails 
module.exports = class Email {
    constructor(name, email, message){
        this.name = name; 
        this.email = email; 
        this.message = message; 
    }
    
    // Creates the email transport
    createTransport(){
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST, 
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Sends the email 
    async send(){
        await this.createTransport().sendMail({
            from: process.env.EMAIL_USERNAME, 
            to: process.env.EMAIL_USERNAME, 
            subject: `Message from ${this.name} (${this.email})`,
            text: this.message, 
            html: `<p> ${this.message}</p>`
        })
    }
}