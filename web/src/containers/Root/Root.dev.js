import React, { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import App from '../../components/App';

export default class Root extends Component {
    render() {
        return <Provider store={this.props.store}>
            <App />
        </Provider>;
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

