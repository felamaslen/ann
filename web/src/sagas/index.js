import { fork, takeEvery } from 'redux-saga/effects';

import * as actions from '../constants/actions';

import { doAsyncTestCall } from './app.saga';

function *watchAsyncTest() {
    yield takeEvery(actions.ASYNC_REQUESTED, doAsyncTestCall);
}

export default function *rootSaga() {
    yield fork(watchAsyncTest);
}

