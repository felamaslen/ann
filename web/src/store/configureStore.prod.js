import { applyMiddleware, createStore, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSagas from '../sagas';
import rootReducer from '../reducers';

const reducer = combineReducers(rootReducer);
const sagaMiddleware = createSagaMiddleware();

export default initialState => {
    const createStoreWithMiddleware = applyMiddleware(sagaMiddleware)(createStore);

    const store = createStoreWithMiddleware(reducer, initialState);

    sagaMiddleware.run(rootSagas);

    return store;
}

