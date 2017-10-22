const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const morgan = require('morgan');
const winston = require('winston');
const uuid = require('uuid/v1');
const tmp = require('tmp');

const { version } = require('../package.json');

const DEV = process.env.NODE_ENV === 'development';

function connectToDb() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_URI || '', (err, db) => {
            if (err) {
                return reject(err);
            }

            return resolve(db);
        });
    });
}

function getNewTempFile() {
    return new Promise((resolve, reject) => {
        tmp.file((err, filename) => {
            if (err) {
                return reject(err);
            }

            return resolve(filename);
        });
    });
}

async function saveTempImageBuffer(data) {
    const tmpFile = await getNewTempFile();

    return new Promise((resolve, reject) => {
        fs.writeFile(tmpFile, data, err => {
            if (err) {
                return reject(err);
            }

            return resolve(tmpFile);
        });
    });
}

function processFile(file, correctValue = null) {
    return new Promise(resolve => {
        let result = '';

        let command = `${path.join(__dirname, '../ann/ann.py')} ${file}`;

        if (correctValue) {
            command += ` ${correctValue}`;
        }

        const child = exec(command);

        child.stdout.on('data', data => {
            result += data;
        });

        child.on('close', () => {
            resolve(result);
        });
    });
}

async function routePostDrawing(req, res) {
    try {
        const token = uuid();

        const db = await connectToDb();

        const data = req.body.data;

        const imageFile = await saveTempImageBuffer(data);

        await db.collection('files')
            .insertOne({ token, imageFile });

        await db.close();

        const result = Number(await processFile(imageFile));

        res.json({ token, result });
    }
    catch (err) {
        winston.log('error', err);

        res.status(500)
            .json({ status: 'Unknown error' });
    }
}

async function routePostResponse(req, res) {
    const token = req.body.token;
    const result = req.body.result;
    const corrected = req.body.corrected;

    if (result === corrected) {
        return res.json({ success: true });
    }

    try {
        const db = await connectToDb();

        const doc = await db.collection('files')
            .findOne({ token });

        if (!doc) {
            await db.close();

            return res.status(404)
                .json({ status: 'Token not found' });
        }

        const { imageFile } = doc;

        await processFile(imageFile, corrected);

        await db.collection('files')
            .deleteOne({ token });

        await db.close();

        return fs.unlink(imageFile, () => {
            res.json({ status: 'done' });
        });
    }
    catch (err) {
        winston('error', err);

        return res.status(500)
            .json({ status: 'Some error occurred' });
    }
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

