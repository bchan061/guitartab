import React from 'react'
import Player from './Player';
import EditorControls from './EditorControls'
import EditableNote from './EditableNote'
import Fret from './../Fret'
import Measure from '../Measure';
import Stats from './Stats'

class Editor extends Player {
    constructor(props) {
        super(props)

        this.saveTab = this.saveTab.bind(this)
        this.saveTabToDatabase = this.saveTabToDatabase.bind(this)
        this.onDeleteNote = this.onDeleteNote.bind(this)
        this.onCreateNote = this.onCreateNote.bind(this)
        this.playStep = this.playStep.bind(this)
        this.changeSteps = this.changeSteps.bind(this)
        this.deleteCurrentMeasure = this.deleteCurrentMeasure.bind(this)
        this.copyMeasure = this.copyMeasure.bind(this)
        this.pasteMeasure = this.pasteMeasure.bind(this)
        this.changeToMeasure = this.changeToMeasure.bind(this)
        this.changeArtist = this.changeArtist.bind(this)
        this.changeTitle = this.changeTitle.bind(this)
        this.changeBPM = this.changeBPM.bind(this)
    }

    /**
     * Changes to the specified measure, if it exists
     * @param {*} measure 
     */
    changeToMeasure(measure) {
        measure = Math.min(Math.max(measure - 1, 0), this.tab.measures.length - 1)
        this.currentMeasureObject = this.tab.measures[measure]
        this.time = this.currentMeasureObject.offset
        this.setState(function(previousState, properties) {
            return {
                currentMeasure: measure,
                currentStep: -1
            }
        })
    }

    /**
     * Copies the current measure.
     */
    copyMeasure() {
        let newMeasure = this.currentMeasureObject
        this.setState(function(previousState, properties) {
            return {
                clipboard: newMeasure
            }
        })
    }

    /**
     * Pastes the measure in the clipboard into the current measure.
     */
    pasteMeasure() {
        if (this.state.clipboard) {
            this.currentMeasureObject.copyFromExistingMeasure(this.state.clipboard)
            this.forceUpdate()
        }
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
     * Saves the current tab by sending it back to the server.
     */
    saveTabToDatabase() {
        let tabJSON = this.tab.exportToJson()

        const urlLink = "http://localhost:3005/saveTab"

        fetch(urlLink, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tabJSON)
        }).then(function(response) {
            return response.json()
        }).then(function(obj) {
            console.log(obj)
        })

        return fetch
    }

    /**
     * Saves the tab to a local file.
     */
    saveTab() {
        let tabJSON = this.tab.exportToJson()
        let data = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tabJSON))

        let link = document.createElement('a')
        link.setAttribute('href', data)
        link.setAttribute('download', this.sanitizeFilename(this.tab.title) + ".json")

        document.body.appendChild(link)
        link.click()
        link.remove()
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
            /* Copy the steps from the previous measure. */
            let previousSteps = this.currentMeasureObject.steps

            let newMeasureOffset = this.tab.startOffset + (this.tab.spm * (this.state.currentMeasure + 1))
            let newMeasure = new Measure(
                this.tab.bpm,
                [[-1], [-1], [-1], [-1], [-1], [-1]],
                newMeasureOffset
            )

            newMeasure.changeSteps(previousSteps)

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
     * Changes the title of the tab.
     * @param {*} event 
     */
    changeTitle(event) {
        this.tab.title = event.target.value
        this.forceUpdate()
    }

    /**
     * Changes the artist of the tab.
     * @param {*} event 
     */
    changeArtist(event) {
        this.tab.artist = event.target.value
        this.forceUpdate()
    }

    /**
     * Changes the BPM of the tab.
     * @param {*} newBPM the new BPM
     */
    changeBPM(newBPM) {
        if (typeof(newBPM) === 'number' && newBPM >= 1 || newBPM <= 999) {
            this.tab.setBPM(newBPM)
            this.forceUpdate()
        }
    }

    /**
     * Renders the editor.
     * Includes the controls.
     */
    render() {
        let tab = this.renderTab()
        return (
            <div className="player">
                <div className="mainPlayer">
                    <span className="titles">
                        <input
                            type="text"
                            className="titleTextbox"
                            value={ this.tab.artist }
                            onChange={ this.changeArtist }
                        /> - <input
                            type="text"
                            className="titleTextbox"
                            value={ this.tab.title }
                            onChange={ this.changeTitle }
                        />
                    </span>

                    { tab }
                </div>

                <EditorControls
                    playing={ this.state.playing }
                    tab={ this.tab }
                    currentMeasure={ this.state.currentMeasure }
                    loop={ this.loop }
                    onPlayPause={ this.playOrPause }
                    onRestart={ this.restart }
                    onLeft={ this.left }
                    onRight={ this.right }
                    onSave={ this.saveTabToDatabase }
                    onChangeCapo={ this.onChangeCapo }
                    onChangeSteps={ this.changeSteps }
                    onDelete={ this.deleteCurrentMeasure }
                    onCopy={ this.copyMeasure }
                    onPaste={ this.pasteMeasure }
                    onChangeMeasure={ this.changeToMeasure }
                    onChangeBPM={ this.changeBPM }
                    onChangeLoop={ this.onChangeLoop }
                    canPaste={ this.state.clipboard !== null }
                    activeLeft={ this.canGoLeft() }
                />
                <Stats
                    tab={ this.tab }
                    strings={ this.strings }
                />
            </div>
        )
    }
}

export default Editor
