const express = require('express');
const bodyParser = require('body-parser');
const {PORT } = require('./config/serverConfig');
const ApiRoutes = require('./routes/index');

// const db = require('./models/index');
// const sequelize = db.sequelize;
//const {Airplane} = require('./models/index');
const city = require('./models/city');
const setupAndStartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true})); 
    app.use('/api', ApiRoutes);  
    app.listen(PORT, '127.0.0.1', async () => {
        console.log(`Server is running on port ${PORT}`);
        if(process.env.DB_SYNC){
             db.sequelize.sync({alter: true});
        }
    //alter:true will update the table if there is any change in the model, force:true will drop the table and create a new one, so we will lose all the data in the table, so we will use alter:true in development and force:true in testing environment    

            
    })
} 
setupAndStartServer();
                                             