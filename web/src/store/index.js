/* eslint-disable global-require */
import { persistStore } from 'redux-persist';

import initialState from '../initialState';

let configStore = null;

if (process.env.NODE_ENV === 'development') {
    configStore = require('./configureStore.dev').default;
}
else {
    configStore = require('./configureStore.prod').default;
}

const store = configStore(initialState);

if (process.env.NODE_ENV !== 'test') {
    persistStore(store, {
        whitelist: ['app', 'user']
    });
}

export default store;

