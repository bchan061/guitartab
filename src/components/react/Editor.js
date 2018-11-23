import React from 'react'
import Player from './Player';
import EditorControls from './EditorControls'
import EditableNote from './EditableNote'
import Fret from './../Fret'
import Measure from '../Measure';

class Editor extends Player {
    constructor(props) {
        super(props)

        this.saveTab = this.saveTab.bind(this)
        this.onChangeTextbox = this.onChangeTextbox.bind(this)
        this.onDeleteNote = this.onDeleteNote.bind(this)
        this.onCreateNote = this.onCreateNote.bind(this)
        this.playStep = this.playStep.bind(this)
        this.changeSteps = this.changeSteps.bind(this)
        this.deleteCurrentMeasure = this.deleteCurrentMeasure.bind(this)
    }

    /**
     * Returns a table column created with the values of the note.
     * @param {*} note the note to play
     * @param {*} i the step of the measure
     * @param {*} string the string number (0 = top E, ...)
     */
    mapMeasureNotesToJSX(note, i, string) {
        return (
            <th key={i} className="playerTableColumn">
                <EditableNote
                    active={ i === this.state.currentStep }
                    note={ note }
                    step={ i }
                    string={ string }
                    onDelete={ this.onDeleteNote }
                    onCreate={ this.onCreateNote }
                    playStep={ this.playStep }
                />
            </th>
        )
    }

    /**
     * Plays the sound at the step.
     * @param {number} step the step
     */
    playStep(step) {
        this.playSoundsAtCurrentTime(step)
    }

    /**
     * Called when a editable textbox deletes a note.
     */
    onDeleteNote(string, step) {
        this.currentMeasureObject.notes[string][step] = null
        this.forceUpdate()
    }

    /**
     * Called when a editable textbox creates a note from an empty textbox.
     */
    onCreateNote(string, step, fret) {
        let newNote = new Fret(fret)
        this.currentMeasureObject.notes[string][step] = newNote
        this.forceUpdate()
    }

    /**
     * Sanitizes the string into an appropriate filename.
     * @param {string} name the name to sanitize
     */
    sanitizeFilename(name) {
        return name.replace(/[\W]/g, "")
    }

    /**
     * Saves the tab.
     */
    saveTab() {
        let tabJSON = this.tab.exportToJson()
        let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tabJSON))

        let link = document.createElement('a')
        link.setAttribute('href', data)
        link.setAttribute('download', this.sanitizeFilename(this.tab.title) + ".json")

        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    /**
     * Called on any note being changed.
     * @param {object} event the event
     */
    onChangeTextbox(event) {
        console.log(event)
        console.log(event.target.value)
    }

    /**
     * Deletes the current measure.
     */
    deleteCurrentMeasure() {
        /** Prevent deleting if there's only one measure left */
        if(this.tab.measures.length > 1) {
            let nextMeasure = this.state.currentMeasure
            if (nextMeasure >= this.tab.measures.length) {
                nextMeasure = this.state.currentMeasure - 1
            }

            this.tab.measures.splice(this.state.currentMeasure, 1)
            this.tab.recalculateOffsets(this.state.currentMeasure)

            this.setState(
                function(previousState, properties) {
                    return {
                        currentMeasure: nextMeasure,
                        currentStep: -1
                    }
                }
            )

            this.forceUpdate()
        }
    }

    /**
     * Goes to the next measure.
     * If the next measure doesn't exist, a new one is created.
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
        } else {
            let newMeasureOffset = this.tab.startOffset + (this.tab.spm * (this.state.currentMeasure + 1))
            let newMeasure = new Measure(
                this.tab.bpm,
                [[-1], [-1], [-1], [-1], [-1], [-1]],
                newMeasureOffset
            )
            this.time = newMeasureOffset
            this.tab.measures[this.state.currentMeasure + 1] = newMeasure
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
     * Changes the steps in the current measure.
     * @param {number} value the new amount of steps
     */
    changeSteps(value) {
        this.currentMeasureObject.changeSteps(value)
        this.forceUpdate()
    }

    /**
     * Renders the editor.
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

                <EditorControls
                    playing={ this.state.playing }
                    tab={ this.tab }
                    currentMeasure={ this.state.currentMeasure }
                    onPlayPause={ this.playOrPause }
                    onRestart={ this.restart }
                    onLeft={ this.left }
                    onRight={ this.right }
                    onSave={ this.saveTab }
                    onChangeCapo={ this.onChangeCapo }
                    onChangeSteps={ this.changeSteps }
                    onDelete={ this.deleteCurrentMeasure }
                    activeLeft={ this.canGoLeft() }
                />
            </div>
        )
    }
}

export default Editor
