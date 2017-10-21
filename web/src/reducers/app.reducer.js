export const requestAsync = state => state.set('loading', true);

export const handleAsyncResponse = (state, response) => state
    .set('loading', false)
    .set('foo', JSON.stringify(response));

