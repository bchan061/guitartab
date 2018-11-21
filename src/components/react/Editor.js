import React from 'react'
import Player from './Player';

class Editor extends Player {
    /**
     * Returns a table column created with the values of the note.
     * @param {*} note the note to play
     * @param {*} i the step of the measure
     */
    mapMeasureNotesToJSX(note, i) {
        let className = "editorTextbox"

        if (i === this.state.currentStep) {
            className += " editorTextboxActive"
        }
        let value = note && note.fret
        if (value == null) {
            value = ''
        }
        return (
            <th key={i} className="playerTableColumn">
                <input type="text" className={ className } value={ value } />
            </th>
        )
    }
}

export default Editor
