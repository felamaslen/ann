import buildAction from './buildAction';
import {
    DRAWING_SENT, RESULT_RECEIVED, RESPONSE_SENT, RESPONSE_RECEIVED
} from '../constants/actions';

export const drawingSent = data => buildAction(DRAWING_SENT, data);
export const resultReceived = response => buildAction(RESULT_RECEIVED, response);
export const responseSent = status => buildAction(RESPONSE_SENT, status);
export const responseReceived = () => buildAction(RESPONSE_RECEIVED);

