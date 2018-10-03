import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import users from './routes/users';
import entries from './routes/entries';
import groups from './routes/groups'
import accountabilityPartners from './routes/accountability-partners';
import isLoggedIn from './helpers/isLoggedIn';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/users', users);
app.use('/api/v1/entries', isLoggedIn, entries);
app.use('/api/v1/accountability-partners', isLoggedIn, accountabilityPartners);
app.use('/api/v1/groups', isLoggedIn, groups);

module.exports = app;
