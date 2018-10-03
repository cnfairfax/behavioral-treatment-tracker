const promise = require('bluebird');

var options = {
    promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgresql://postgres:Jah1sm1ghty@localhost:5432/bible_study';
var db = pgp(connectionString);

export default db