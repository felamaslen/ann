/* eslint-disable no-underscore-dangle, global-require */
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { createLogger } from 'redux-logger';

import rootSaga from '../sagas';
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
    collapsed: true
});

const newStore = initialState => {
    const createStoreWithMiddleware = compose(
        applyMiddleware(sagaMiddleware, logger)
    )(createStore);

    const store = createStoreWithMiddleware(
        rootReducer,
        initialState,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

    sagaMiddleware.run(rootSaga);

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            store.replaceReducer(require('../reducers').default);
        });
    }

    return store;
};

export default newStore;
