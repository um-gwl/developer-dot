/* global SwaggerUi */
import React from 'react';
import {render} from 'react-dom';
import App from './App';
import {store} from './store';

render(<App api={store.getState().apiInfo} error={null}/>, document.getElementById('api-console'));

store.subscribe(() => {
    const state = store.getState();
    const api = state.apiInfo;
    const error = state.error;

    /* eslint-disable no-console */
    console.log('NEW STATE', state);
    /* eslint-enable no-console */
    render(<App api={api} error={error}/>, document.getElementById('api-console'));
});

