import { fork, takeEvery } from 'redux-saga/effects';

import * as actions from '../constants/actions';

import { sendDrawing, sendResponse } from './app.saga';

function *watchDrawingSent() {
    yield takeEvery(actions.DRAWING_SENT, sendDrawing);
}

function *watchResponseSent() {
    yield takeEvery(actions.RESPONSE_SENT, sendResponse);
}

export default function *rootSaga() {
    yield fork(watchDrawingSent);
    yield fork(watchResponseSent);
}

