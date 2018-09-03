import React, { Component } from 'react'
import { Howl } from 'howler'
import './style/AppStyle.css'

import SoundUtilities from './utilities/SoundUtilities'
import Strings from './components/Strings'
import Timer from './components/Timer'

class App extends Component {
    render() {
        return (
            <div className="app">
                <Timer bpm={129} metronome={true}/>
                <Strings />
            </div>
        )
    }
}

export default App;
