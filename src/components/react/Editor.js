import React from 'react'
import Player from './Player';
import EditorControls from './EditorControls'
import EditableNote from './EditableNote'

class Editor extends Player {
    constructor(props) {
        super(props)

        this.saveTab = this.saveTab.bind(this)
        this.onChangeTextbox = this.onChangeTextbox.bind(this)
    }

    /**
     * Returns a table column created with the values of the note.
     * @param {*} note the note to play
     * @param {*} i the step of the measure
     */
    mapMeasureNotesToJSX(note, i) {
        return (
            <th key={i} className="playerTableColumn">
                <EditableNote
                    active={ i === this.state.currentStep }
                    note={ note }
                    onDelete={  }
                />
            </th>
        )
    }

    /**
     * Saves the tab.
     */
    saveTab() {
        let tabJSON = this.tab.exportToJson()
        console.log(tabJSON)
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
                    onPlayPause={ this.playOrPause }
                    onRestart={ this.restart }
                    onLeft={ this.left }
                    onRight={ this.right }
                    onSave={ this.saveTab }
                    activeLeft={ this.canGoLeft() }
                    activeRight={ this.canGoRight() }
                />
            </div>
        )
    }
}

export default Editor
