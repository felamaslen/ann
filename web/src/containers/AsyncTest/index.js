import { connect } from 'react-redux';

import { asyncRequested } from '../../actions/app.actions';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class AsyncTest extends Component {
    render() {
        const loadingStatus = this.props.loading
            ? 'loading...'
            : 'press the button to load';

        return <div>
            <div>
                <button onClick={() => this.props.request()}>Click me</button>
            </div>
            <div>
                <span>{'Result: '}</span>
                <span className="async-test">{this.props.foo}</span>
            </div>
            <div>
                <span className="loading">{loadingStatus}</span>
            </div>
        </div>;
    }
}

AsyncTest.propTypes = {
    foo: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    request: PropTypes.func.isRequired
};

export default connect(state => ({
    foo: state.get('foo'),
    loading: state.get('loading')
}), dispatch => ({
    request: () => dispatch(asyncRequested())
}))(AsyncTest);

