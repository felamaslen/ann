import axios from 'axios';

import { put, select } from 'redux-saga/effects';

import { resultReceived, responseReceived } from '../actions/app.actions';

export function *sendDrawing({ payload }) {
    try {
        const response = yield axios.post('drawing', { data: payload });

        yield put(resultReceived(response.data));
    }
    catch (err) {
        yield put(resultReceived({ err }));
    }
}

const getToken = state => state.get('resultToken');
const getResult = state => state.get('receivedResult');

export function *sendResponse({ payload }) {
    try {
        const token = yield select(getToken);
        const result = yield select(getResult);

        const corrected = payload;

        yield axios.post('correct', { token, corrected, result });

        yield put(responseReceived());
    }
    catch (err) {
        yield put(responseReceived({ err }));
    }
}

