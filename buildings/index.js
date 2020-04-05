const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes');
const DB = require('./database/config');
const Log = require('./log')('[SERVER]');

const server = express();

server.use(express.json());
server.use(routes);

mongoose.connect(DB.DB_URL, DB.DB_SETTINGS, (err) => {
    if(!err) {
        Log.print(`✔ Connected to MongoDB`);
    } else {
        Log.print(`✖ Error while connecting to MongoDB.\n${err}`);
    }
});

server.listen(process.env.PORT, () => {
    Log.print(`✔ Buildings service running at port ${process.env.PORT}`)
});