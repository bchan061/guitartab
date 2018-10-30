import React, { Component } from 'react'
import './style/AppStyle.css'

import TestData from './test/TestData'

import Player from './components/react/Player'
import SoundUtilities from './utilities/SoundUtilities';
import Sounds from './components/Sounds'

class App extends Component {
    constructor(props) {
        super(props)
        Sounds.init()
    }

    render() {
        return (
            <div className="app">
                <Player data={ TestData }/>
            </div>
        )
    }
}

export default App;
