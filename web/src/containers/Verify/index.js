import { connect } from 'react-redux';

import { responseSent } from '../../actions/app.actions';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { RESPONSE_VALUES } from '../../constants/values';

export class Verify extends Component {
    render() {
        if (!this.props.active) {
            return null;
        }

        const disabled = this.props.sending;

        const onResultCorrect = () => this.props.send(this.props.receivedResult);

        const correctionButtons = RESPONSE_VALUES.map((value, key) => {
            const onClick = () => this.props.send(key);

            return <button key={value} onClick={onClick} disabled={disabled}>{value}</button>;
        });

        return <div className="verify-outer">
            <div className="result-received">
                <span>{'Received response:'}</span>
                <span className="response">{this.props.receivedResult}</span>
            </div>
            <div className="correction-header">{'Correct response:'}</div>
            <div className="correct-response-outer">
                <button className="button-correct-response" onClick={onResultCorrect}
                    disabled={disabled}>{'This was correct'}</button>
            </div>
            <div className="buttons">
                {correctionButtons}
            </div>
        </div>;
    }
}

Verify.propTypes = {
    active: PropTypes.bool.isRequired,
    sending: PropTypes.bool.isRequired,
    receivedResult: PropTypes.string,
    send: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    active: Boolean(state.get('receivedResult') && state.get('resultToken')),
    sending: state.get('sendingResponse'),
    receivedResult: state.get('receivedResult')
});

const mapDispatchToProps = dispatch => ({
    send: corrected => dispatch(responseSent(corrected))
});

export default connect(mapStateToProps, mapDispatchToProps)(Verify);

