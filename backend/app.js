const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const postRouter = require('../backend/routes/posts');
const userRoutes = require ('./routes/user');
const { RESOURCE_CACHE_PROVIDER } = require('@angular/platform-browser-dynamic');

const app = express();

const URI = 'mongodb+srv://dbUser:' + process.env.MONGO_ATLAS_PW + '@cluster0.q2xnh.mongodb.net/test?retryWrites=true&w=majority';

mongoose
    .connect(
        URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }
    )
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json())
app.use("/images", express.static(path.join("backend/images")))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

    next()
})
app.use('/api/posts', postRouter);
app.use('/api/user', userRoutes)

module.exports = app;
