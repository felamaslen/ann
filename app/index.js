const dotenv = require('dotenv');
if (process.env.LOAD_DOTENV || process.env.NODE_ENV === 'development') {
    dotenv.config();
}

const run = require('./server');

run();

