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
            time: SoundUtilities.bpmToMilliseconds(this.props.bpm),
            metronome: this.props.metronome,
            elapsed: 0
        }

        this.metronome = new Howl({
            src: ['sounds/metronome.wav']
        })

        this.tick = this.tick.bind(this)
        this.switchStatus = this.switchStatus.bind(this)

        this.timer = setInterval(this.tick, this.state.time)
    }

    switchStatus() {
        this.setState(function(previousState, properties) {
            return {
                metronome: !previousState.metronome
            }
        })
    }

    tick() {
        if (this.state.metronome) {
            this.metronome.play()
        }

        this.setState(function(previousState, properties) {
            return {
                elapsed: previousState.elapsed + this.state.time
            }
        })
    }

    render() {
        return (
            <div>
                <p> Timer {!this.state.metronome && 'in'}active at BPM { this.props.bpm } ({ this.state.time } ms). </p>
                <p> Time elapsed: { this.state.elapsed } </p>
                <input type="button" value="Metronome" onClick={ this.switchStatus }/>
            </div>
        )
    }
}

export default Timer
