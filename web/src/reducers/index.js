import { createReducer } from 'redux-create-reducer';

import initialState from '../initialState';

import * as actions from '../constants/actions';

import * as app from './app.reducer';

const reducers = [
    [actions.DRAWING_SENT, app.sendDrawing],
    [actions.RESULT_RECEIVED, app.handleResult],
    [actions.RESPONSE_SENT, app.sendResultResponse],
    [actions.RESPONSE_RECEIVED, app.handleResponseResult]
];

export default createReducer(initialState, reducers.reduce((reducerObject, reducer) => {
    reducerObject[reducer[0]] = (state, action) => reducer[1](state, action.payload);

    return reducerObject;
}, {}));

