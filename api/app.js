import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import users from './routes/users';
import locations from './routes/locations';
import isLoggedIn from './helpers/isLoggedIn';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', users);
app.use('/api/v1/locations', isLoggedIn, locations)

module.exports = app;
