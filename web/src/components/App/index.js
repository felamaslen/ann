import React from 'react';

import AsyncTest from '../../containers/AsyncTest';
import Draw from '../../containers/Draw';

export default function App() {
    return <div className="neural-network-trainer-app">
        <AsyncTest />
        <Draw />
    </div>
}

