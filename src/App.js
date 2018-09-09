import React, { Component } from 'react'
import './style/AppStyle.css'

import TestData from './test/TestData'

import Player from './components/Player'

class App extends Component {
    render() {
        return (
            <div className="app">
                <Player data={ TestData }/>
            </div>
        )
    }
}

export default App;
