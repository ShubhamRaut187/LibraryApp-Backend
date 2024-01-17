const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Middlewares/swagger');
//Routes
const {AuthRoutes} = require('./Routes/AuthRoutes'); 
const {BookRoutes} = require('./Routes/BookRoutes');

// Database Connection
const {connection} = require('./Configuration/db');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


// Routes
app.get('/',async(req,res)=>{
    res.status(200).send('Welcome to library app server !');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth',AuthRoutes);
app.use('/books',BookRoutes);


// Server Connection
app.listen(8000,async()=>{
    try {
        await connection;
        console.log('Connection to DB established on port 800');
    } catch (error) {
        console.log('Error connecting database');
        console.log(error);
    }
})