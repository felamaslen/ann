import { createReducer } from 'redux-create-reducer';

import initialState from '../initialState';

import * as actions from '../constants/actions';

import * as app from './app.reducer';

const reducers = [
    [actions.ASYNC_REQUESTED, app.requestAsync],
    [actions.ASYNC_RECEIVED, app.handleAsyncResponse]
];

export default createReducer(initialState, reducers.reduce((reducerObject, reducer) => {
    reducerObject[reducer[0]] = (state, action) => reducer[1](state, action.payload);

    return reducerObject;
}, {}));

