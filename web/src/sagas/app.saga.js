import axios from 'axios';

import { put } from 'redux-saga/effects';

import { asyncReceived } from '../actions/app.actions';

export function *doAsyncTestCall() {
    try {
        const response = yield axios.get('/async-test');

        yield put(asyncReceived(response.data));
    }
    catch (err) {
        yield put(asyncReceived({ error: true }));
    }
}

