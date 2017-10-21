const express = require('express');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');

const { version } = require('../package.json');

const DEV = process.env.NODE_ENV === 'development';

function routes(app) {
    app.set('views', path.join(__dirname, '../web/src/templates'));
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => res.render('index', { version }));

    app.get('/async-test', (req, res) => {
        setTimeout(() => res.json({ success: true }), 250);
    });

    app.use(express.static(path.join(__dirname, '../web/build')));

    app.use((req, res) => {
        res.status(404)
            .json({ status: 'Not found' });
    });
}

function run() {
    const app = express();

    routes(app);

    if (DEV) {
        app.use(morgan('dev'));
    }
    else {
        app.use(morgan('common'));
    }

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        winston.info('Server listening on port', port);
    });
}

module.exports = run;

