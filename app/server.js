const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const uuid = require('uuid/v1');

const { version } = require('../package.json');

const DEV = process.env.NODE_ENV === 'development';

function routePostDrawing(req, res) {
    const token = uuid();

    const image = req.body;

    // TODO: pass the image through a neural network

    const character = '5';

    res.json({ token, character });
}

function routePostResponse(req, res) {
    const token = req.body.token;
    const result = req.body.result;
    const corrected = req.body.corrected;

    if (result === corrected) {
        return res.json({ success: true });
    }

    // TODO: back-propagate neural network

    return res.json({ pending: true, ...req.body });
}

function routes(app) {
    app.set('views', path.join(__dirname, '../web/src/templates'));
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => res.render('index', { version }));

    app.post('/drawing', routePostDrawing);

    app.post('/correct', routePostResponse);

    app.use(express.static(path.join(__dirname, '../web/build')));

    app.use((req, res) => {
        res.status(404)
            .json({ status: 'Not found' });
    });
}

function run() {
    const app = express();

    app.use(bodyParser.json());

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

