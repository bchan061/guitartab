import React from 'react'

import String from './String'
import Tab from './../Tab'
import Sounds from './../Sounds'

/**
 * The tab player.
 */
class Player extends React.Component {
    /**
     * Initializes an empty player.
     * @param {*} props the properties
     */
    constructor(props) {
        super(props)

        this.state = {
            time: 0
        }

        this.tab = new Tab(this.props.data)

        this.initializeStrings(this.tab.capo)

        this.previousTimestamp = null

        this.update = this.update.bind(this)
    }

    /**
     * Starts the animation loop.
     */
    componentDidMount() {
        window.requestAnimationFrame(this.update)
    }

    /**
     * Initializes the strings of the player.
     */
    initializeStrings(capo) {
        this.strings = []

        this.addString("E", 64, capo)
        this.addString("B", 59, capo)
        this.addString("G", 55, capo)
        this.addString("D", 50, capo)
        this.addString("A", 45, capo)
        this.addString("E", 40, capo)
    }

    /**
     * Adds the string into the array.
     * @param {string} name the name of the string
     * @param {number} midiNote the MIDI pitch of the note
     */
    addString(name, midiNote, capo) {
        let string = {
            name: name,
            pitch: midiNote,
            capo: capo
        }
        this.strings.push(string)
    }

    update(timestamp) {
        /* Delta time in seconds */
        let delta = 0
        if (this.previousTimestamp != null) {
            delta = timestamp - this.previousTimestamp
            /* Multiply by 1000 for seconds */
            delta /= 1000
        }

        this.setState(
            function(previousState, properties) {
                return {
                    time: previousState.time + delta
                }
            }
        )

        this.previousTimestamp = timestamp

        window.requestAnimationFrame(this.update)
    }

    render() {
        let time = this.state.time
        let tab = this.tab
        return (
            <div className="player">
                <table className="playerTable">
                    <tbody>
                        {
                            this.strings && this.strings.map(
                                function(string, i) {
                                    return <String
                                            key={i}
                                            name={ string.name }
                                            pitch={ string.pitch }
                                            capo={ string.capo }
                                            sound={ Sounds.stringSounds[i] }
                                            time={ time }
                                            noteContainer={ tab.noteContainers[i] }
                                            />
                                }
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Player
