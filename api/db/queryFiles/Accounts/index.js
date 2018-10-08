import path from 'path';
import pgp from 'pg-promise';
import fs from 'fs';

import loadQueries from '../loadSql.js'

const accountQueries = loadQueries(__dirname);

export default accountQueries;