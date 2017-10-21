import buildAction from './buildAction';
import { ASYNC_REQUESTED, ASYNC_RECEIVED } from '../constants/actions';

export const asyncRequested = () => buildAction(ASYNC_REQUESTED);
export const asyncReceived = response => buildAction(ASYNC_RECEIVED, response);

