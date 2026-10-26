const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');

const ticketController = require('./controllers/ticket-controller');

//const { sendBasicEmail } = require('./services/email-service');

const jobs = require('./utils/job');

const cron = require('node-cron');


const setupAndStartServer = () => {
    const app = express();
    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/api/v1/tickets', ticketController.create);

    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Remainder Service is running on port ${PORT}`);
    // sendBasicEmail(
    //     'sender@example.com',
    //     'manishxyz333@gmail.com',
    //     'Test Email',
    //     'This is a test email by Manish Mishra server project.'
    // )
    jobs();

    
            

    });
}   
setupAndStartServer();