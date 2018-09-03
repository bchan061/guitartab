import React, { Component } from 'react'
import { Howl } from 'howler'
import './style/AppStyle.css'

import Player from './components/Player'

class App extends Component {
    render() {
        return (
            <div className="app">
                <Player />
            </div>
        )
    }
}

export default App;
