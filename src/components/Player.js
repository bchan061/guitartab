import React from 'react'
import Timer from './Timer'
import Strings from './Strings'

import QueueTest from './../structures/QueueTest'

class Player extends React.Component {
    render() {
        return (
            <div>
                <Timer bpm={128} metronome={false}/>
                <Strings />
                <QueueTest />
            </div>
        )
    }
}

export default Player
