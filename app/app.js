const createError = require('http-errors');
const boduParser = require('body-parser');
const logger = require('morgan');
const express = require('express');
const route = require('./routes');
const passport = require('passport');

var app = express();

app.use(logger('dev'));
app.use(boduParser.json());
app.use(boduParser.urlencoded({extended: false}));



app.use('/api/v1', route);
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/USERS', {useNewUrlParser: true})


module.exports = app;