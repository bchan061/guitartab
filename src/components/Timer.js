import React from 'react'
import { Howl } from 'howler'
import SoundUtilities from './../utilities/SoundUtilities'

/**
 * A timer for the tab.
 * 
 * Expected properties:
 *   - bpm: the beats per minute
 *   - metronome: whether the timer should be voiced
 */
class Timer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            time: SoundUtilities.bpmToMilliseconds(this.props.bpm)
        }

        this.metronome = new Howl({
            src: ['sounds/metronome.wav']
        })

        this.tick = this.tick.bind(this)
        this.timer = setInterval(this.tick, this.state.time)

        console.log(this.state.time)
    }

    tick() {
        if (this.props.metronome) {
            this.metronome.play()
        }
    }

    render() {
        return (
            <p> Timer active at BPM { this.props.bpm } ({ this.state.time } ms). </p>
        )
    }
}

export default Timer
