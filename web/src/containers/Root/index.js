/* eslint-disable global-require */

if (process.env.NODE_ENV === 'development') {
    module.exports = require('./Root.dev').default;
} else {
    module.exports = require('./Root.prod').default;
}

