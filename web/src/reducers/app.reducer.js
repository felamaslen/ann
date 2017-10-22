import { RESPONSE_VALUES } from '../constants/values';

export const sendDrawing = state => state
    .set('sending', true);

const resetState = state => state
    .set('sendingResponse', false)
    .set('sent', false)
    .set('receivedResult', null)
    .set('resultToken', null);

export function handleResult(state, data = null) {
    const sentState = state.set('sending', false);

    if (!data) {
        return sentState;
    }

    try {
        const { result, token } = data;

        const character = RESPONSE_VALUES[result];

        return sentState
            .set('sent', true)
            .set('receivedResult', character)
            .set('resultToken', token);
    }
    catch (err) {
        return resetState(sentState);
    }
}

export const sendResultResponse = state => state
    .set('sendingResponse', true);

export const handleResponseResult = state => resetState(state);

