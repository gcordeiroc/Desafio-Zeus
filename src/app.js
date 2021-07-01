const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const app = express();

/*
    Environments
*/
const { DB_CONNECT, PORT = '3000' } = process.env;

/* Allow cors */
app.use(cors());

/*
    Database Setup
*/
mongoose.connect(DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

/* Set views */
app.use(require('./views/index'));

/* Rotas */
app.all('*', require('./routes/index'));

app.listen(PORT, () => console.log('Server running at ', PORT));