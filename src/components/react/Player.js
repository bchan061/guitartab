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
        this.loopCurrentMEasure = false

        this.tab = new Tab(this.props.data)
        this.initializeStrings(this.tab.capo)

        this.update = this.update.bind(this)
        this.restart = this.restart.bind(this)
        this.playOrPause = this.playOrPause.bind(this)
        this.left = this.left.bind(this)
        this.right = this.right.bind(this)
        this.canGoLeft = this.canGoLeft.bind(this)
        this.canGoRight = this.canGoRight.bind(this)
        this.onChangeCapo = this.onChangeCapo.bind(this)
        this.onChangeLoop = this.onChangeLoop.bind(this)
    }

    /**
     * Starts the animation loop.
     */
    componentDidMount() {
        window.requestAnimationFrame(this.update)
    }

    /**
     * Swaps the current tab for a new tab in this.props.tab
     * @param {object} newData the new tab data
     */
    swapTab(newData) {
        this.tab = new Tab(newData)
        this.currentMeasureObject = this.tab.measures[0]
        this.updateStrings(this.tab.capo)
        this.restart()
        this.forceUpdate()
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
     * Updates the strings of the player.
     * @param {number} newCapo the new capo value
     */
    updateStrings(newCapo) {
        for (let i = 0; i < this.strings.length; i++) {
            let string = this.strings[i]
            string.capo = newCapo
        }
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

    /**
     * Returns whether the React component should update or not.
     * @param {*} nextProps the next properties of the component
     * @param {*} nextState the next state of the component
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.data['id'] !== this.props.data['id']) {
            this.swapTab(nextProps.data)
        }

        return (
            this.state.currentMeasure !== nextState.currentMeasure ||
            this.state.currentStep !== nextState.currentStep ||
            this.state.playing !== nextState.playing
        )
    }

    /**
     * Restarts the player at the beginning.
     */
    restart() {
        this.time = 0
        this.setState(
            function(previousState, properties) {
                return {
                    currentMeasure: 0,
                    currentStep: -1
                }
            }
        )
    }

    /**
     * Either plays (if paused) or pauses (if playing) the current tab.
     */
    playOrPause() {
        this.setState(
            function(previousState, properties) {
                return {
                    playing: !previousState.playing
                }
            }
        )
    }

    /**
     * Returns if the current measure is out of bounds.
     * In other words, there is no measure at the current position.
     */
    checkIfOutOfBounds() {
        return this.currentMeasureObject == null
    }

    /**
     * Returns if there are any measures before the current one.
     */
    canGoLeft() {
        return (this.state.currentMeasure > 0)
    }

    /**
     * Goes to the previous measure.
     */
    left() {
        if (this.canGoLeft()) {
            this.time = this.tab.measures[this.state.currentMeasure - 1].offset
            this.setState(
                function(previousState, properties) {
                    return {
                        currentMeasure: previousState.currentMeasure - 1,
                        currentStep: -1
                    }
                }
            )
        }
    }

    /**
     * Returns if there are any measures after the next one.
     */
    canGoRight() {
        return (this.state.currentMeasure < this.tab.measures.length - 1)
    }

    /**
     * Goes to the next measure.
     */
    right() {
        if (this.canGoRight()) {
            this.time = this.tab.measures[this.state.currentMeasure + 1].offset
            this.setState(
                function(previousState, properties) {
                    return {
                        currentMeasure: previousState.currentMeasure + 1,
                        currentStep: -1
                    }
                }
            )
        }
    }

    /**
     * Updates the player with a timestamp.
     * Schedules another update with requestAnimationFrame.
     * @param {} timestamp the current timestamp
     */
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
            /** Get ready to get to the next measure. */
            if (this.loop) {
                this.newStep = true
                this.time = this.currentMeasureObject.offset + (this.time - this.currentMeasureObject.stepTime)
                currentStep = Math.floor((this.time - this.currentMeasureObject.offset) / this.currentMeasureObject.stepTime)
            } else {
                measureDelta = 1
                this.currentMeasureObject = this.tab.measures[this.state.currentMeasure + 1]
                this.newStep = true
                if (this.currentMeasureObject != null) {
                    currentStep = Math.floor((this.time - this.currentMeasureObject.offset) / this.currentMeasureObject.stepTime)
                } else {
                    willStop = true
                }
            }
        }

        if (this.state.currentStep !== currentStep) {
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

    /**
     * Plays the sounds at the current step.
     * @param {number} step the number of the step
     */
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

    /**
     * Returns a table column created with the values of the note.
     * @param {*} note the note to play
     * @param {*} i the step of the measure
     * @param {*} string the string number (0 = top E, ...)
     */
    mapMeasureNotesToJSX(note, i, string) {
        let className = "playerTableColumn "
        if (i === this.state.currentStep) {
            if (note != null) {
                className += "playerTableActive "
            } else {
                className += "playerTableCurrent "
            }
        }
        return (
            <td key={i} className={ className }>
                { note && note.fret }
            </td>
        )
    }

    /**
     * Renders a measure.
     * @param {object} measure the measure to render
     */
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
                        function(string, stringI) {
                            let stringNotes = notes[stringI]
                            return (
                                <tr key={stringI} className="playerTableRow">
                                    <td className="playerTableString"> { strings[stringI].name } </td>
                                    {
                                        stringNotes && stringNotes.map(
                                            function(note, i) {
                                                return mapNotesFunction(note, i, stringI)
                                            }
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

    /**
     * Renders a tab.
     */
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

    /**
     * Changes the capo for the tab.
     * @param {*} value the capo value to change to
     */
    onChangeCapo(value) {
        this.tab.capo = value

        for (let stringI = 0; stringI < 6; stringI++) {
            this.strings[stringI].capo = value
        }

        this.forceUpdate()
    }

    /**
     * Changes whether to loop or not.
     * @param {boolean} shouldLoop the new loop status
     */
    onChangeLoop(shouldLoop) {
        this.loop = shouldLoop
        this.forceUpdate()
    }

    /**
     * Renders the player.
     * Includes the controls.
     */
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
                    tab={ this.tab }
                    currentMeasure={ this.state.currentMeasure }
                    loop={ this.loop }
                    onPlayPause={ this.playOrPause }
                    onRestart={ this.restart }
                    onLeft={ this.left }
                    onRight={ this.right }
                    activeLeft={ this.canGoLeft() }
                    activeRight={ this.canGoRight() }
                    onChangeCapo={ this.onChangeCapo }
                    onChangeLoop={ this.onChangeLoop }
                />
            </div>
        )
    }
}

export default Player
