const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'development') {
    dotenv.config();
}

const run = require('./server');

run();

