export const sendDrawing = state => state
    .set('sending', true);

const resetState = state => state
    .set('sendingResponse', false)
    .set('sent', false)
    .set('receivedResult', null)
    .set('resultToken', null);

export function handleResult(state, result = null) {
    const sentState = state.set('sending', false);

    if (!result) {
        return sentState;
    }

    try {
        const { character, token } = result;

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

