require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./Routes/userRoutes');
const express = require('express');
const app = express();
const apps = app;
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(
    session({ secret: 'mySecret', resave: false, saveUninitialized: true }));
const passport = require('./passport');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
const cors = require('cors');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

mongoose.connect(`${process.env.DB_CONNECTION}://${process.env.DB_HOST}/${process.env.DB_DATABASE}`)
    .then(() => {
        console.log('Connected to Database...');
    })
    .catch((err) => console.log('Could not connect to Database', err));

app.get('/set', function (req, res, next) {
    res.cookie('jwt', 'token').send({
        message: 'Login Successfully',
    });
});

app.use('/api', userRoutes);

app.listen(process.env.DB_PORT, () => {
    console.log('listening port...' + String(process.env.DB_PORT));
});
