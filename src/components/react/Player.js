import React from 'react'

import GuitarString from './../GuitarString'
import Tab from './../Tab'
import Sounds from './../Sounds'
import PlayerControls from './PlayerControls'

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
            currentMeasure: 0,
            currentStep: 0,
            playing: false
        }

        this.strings = []
        this.previousTimestamp = null
        this.newStep = true
        this.currentMeasureObject = null
        this.time = 0

        this.tab = new Tab(this.props.data)
        this.initializeStrings(this.tab.capo)

        this.update = this.update.bind(this)
        this.restart = this.restart.bind(this)
        this.playOrPause = this.playOrPause.bind(this)
        this.left = this.left.bind(this)
        this.right = this.right.bind(this)
        this.canGoLeft = this.canGoLeft.bind(this)
        this.canGoRight = this.canGoRight.bind(this)
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
        this.addString("E", 64, Sounds.e4, capo)
        this.addString("B", 59, Sounds.b3, capo)
        this.addString("G", 55, Sounds.g3, capo)
        this.addString("D", 50, Sounds.d3, capo)
        this.addString("A", 45, Sounds.a2, capo)
        this.addString("E", 40, Sounds.e2, capo)
    }

    /**
     * Adds the string into the array.
     * @param {string} name the name of the string
     * @param {number} midiNote the MIDI pitch of the note
     */
    addString(name, midiNote, sound, capo) {
        let string = new GuitarString(name, midiNote, sound, capo)
        this.strings.push(string)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.state.currentMeasure !== nextState.currentMeasure ||
            this.state.currentStep !== nextState.currentStep ||
            this.state.playing !== nextState.playing
        )
    }

    restart() {
        this.time = 0
        this.setState(
            function(previousState, properties) {
                return {
                    currentMeasure: 0,
                    currentStep: 0
                }
            }
        )
    }

    playOrPause() {
        this.setState(
            function(previousState, properties) {
                return {
                    playing: !previousState.playing
                }
            }
        )
    }

    checkIfOutOfBounds() {
        return this.currentMeasureObject == null
    }

    canGoLeft() {
        return (this.state.currentMeasure > 0)
    }

    left() {
        if (this.canGoLeft()) {
            this.time = this.tab.measures[this.state.currentMeasure - 1].offset
            this.setState(
                function(previousState, properties) {
                    return {
                        currentMeasure: previousState.currentMeasure - 1
                    }
                }
            )
        }
    }

    canGoRight() {
        return (this.state.currentMeasure < this.tab.measures.length - 1)
    }

    right() {
        if (this.canGoRight()) {
            this.time = this.tab.measures[this.state.currentMeasure + 1].offset
            this.setState(
                function(previousState, properties) {
                    return {
                        currentMeasure: previousState.currentMeasure + 1
                    }
                }
            )
        }
    }

    update(timestamp) {
        if (this.state.playing) {
            /* Delta time in seconds */
            let delta = 0
            if (this.previousTimestamp != null) {
                delta = timestamp - this.previousTimestamp
                /* Divide by 1000 for seconds */
                delta /= 1000
            }

            this.time += delta
        }

        this.currentMeasureObject = this.tab.measures[this.state.currentMeasure]

        let measureDelta = 0
        let willStop = false

        if (this.currentMeasureObject == null) {
            return
        }
        let currentStep = Math.floor((this.time - this.currentMeasureObject.offset) / this.currentMeasureObject.stepTime)

        if (currentStep >= this.currentMeasureObject.steps) {
            measureDelta = 1
            this.currentMeasureObject = this.tab.measures[this.state.currentMeasure + 1]
            this.newStep = true
            if (this.currentMeasureObject != null) {
                currentStep = Math.floor((this.time - this.currentMeasureObject.offset) / this.currentMeasureObject.stepTime)
            } else {
                willStop = true
            }
        }

        if (this.state.currentStep != currentStep) {
            this.newStep = true
        }

        if (this.newStep && !willStop) {
            this.playSoundsAtCurrentTime(currentStep)
        }
        this.newStep = false
        
        if (willStop) {
            this.setState(
                function(previousState, properties) {
                    return {
                        currentMeasure: 0,
                        currentStep: 0,
                        playing: false
                    }
                }
            )
            this.time = 0
        } else {
            this.setState(
                function(previousState, properties) {
                    return {
                        currentMeasure: previousState.currentMeasure + measureDelta,
                        currentStep: currentStep
                    }
                }
            )
        }


        this.previousTimestamp = timestamp

        window.requestAnimationFrame(this.update)
    }

    playSoundsAtCurrentTime(step) {
        let notes = this.currentMeasureObject.notes
        for (let i = 0; i < this.strings.length; i++) {
            let stringNotes = notes[i]
            let stringNote = stringNotes[step]
            if (stringNote != null) {
                this.strings[i].playFret(stringNote.fret)
            }
        }
    }

    mapMeasureNotesToJSX(note, i) {
        let className = "playerTableContainer "
        if (i === this.state.currentStep) {
            className += "playerTableActive"
        } else {
            className += "playerTableInactive"
        }
        return (
            <th key={i} className="playerTableColumn">
                <span className={ className }>
                    { note && note.fret }
                </span>
            </th>
        )
    }

    renderMeasure(measure) {
        if (measure == null) {
            return
        }
        let notes = measure.notes
        let strings = this.strings
        let mapNotesFunction = this.mapMeasureNotesToJSX.bind(this)
        return (
            <tbody>
                {
                    notes && notes.map(
                        function(string, i) {
                            let stringNotes = notes[i]
                            return (
                                <tr key={i} className="playerTableRow">
                                    <th className="playerTableString"> { strings[i].name } </th>
                                    {
                                        stringNotes && stringNotes.map(
                                            mapNotesFunction
                                        )
                                    }
                                </tr>
                            )
                        }
                    )
                }
            </tbody>
        )
    }

    renderTab() {
        let measure = this.renderMeasure(this.currentMeasureObject)
        return (
            <div className="player">
                <table className="playerTable">
                    { measure }
                </table>
            </div>
        )
    }

    render() {
        let tab = this.renderTab()
        let title = this.tab.title
        let subtitle = this.tab.artist
        return (
            <div className="player">
                <div className="mainPlayer">
                    <h1> { title } </h1>
                    <h3> { subtitle } </h3>

                    { tab }
                </div>

                <PlayerControls
                    playing={ this.state.playing }
                    onPlayPause={ this.playOrPause }
                    onRestart={ this.restart }
                    onLeft={ this.left }
                    onRight={ this.right }
                    activeLeft={ this.canGoLeft() }
                    activeRight={ this.canGoRight() }
                />
            </div>
        )
    }
}

export default Player
