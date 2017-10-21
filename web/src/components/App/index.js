import React from 'react';

import Draw from '../../containers/Draw';
import Verify from '../../containers/Verify';

export default function App() {
    return <div className="neural-network-trainer-app">
        <Draw />
        <Verify />
    </div>
}

