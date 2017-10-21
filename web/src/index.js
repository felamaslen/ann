import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';

import store from './store';

import Root from './containers/Root';

function renderApp(RootComponent = Root) {
    render(
        <AppContainer>
            <RootComponent store={store} />
        </AppContainer>,
        document.getElementById('root')
    );
}

renderApp();

if (module.hot) {
    module.hot.accept(
        './containers/Root',
        () => renderApp(require('./containers/Root'))
    );
}

