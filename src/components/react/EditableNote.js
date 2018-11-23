import React from 'react'

/**
 * A textbox that represents a note.
 * Can be edited.
 */
class EditableNote extends React.Component {
    /**
     * Creates the editable note.
     * @param {object} props 
     */
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    /**
     * Limits the fret to a sensible number in the fretboard.
     * @param {number} fret the fret to limit
     */
    limitFret(fret) {
        return Math.max(Math.min(fret, 24), 0)
    }

    /**
     * Called upon a change in the textbox.
     * @param {object} event 
     */
    onChange(event) {
        let textValue = event.target.value
        let newFret = parseInt(textValue)
        /* Handle blank textboxes and if new fret is NaN */
        if (textValue === '' || isNaN(newFret)) {
            newFret = null
        }

        if (newFret == null) {
            this.props.onDelete(this.props.string, this.props.step)
        } else {
            /** Make sure the fret is sensible (e.g. not below 0, not above 24) */
            newFret = this.limitFret(newFret)
            if (this.props.note == null) {
                this.props.onCreate(this.props.string, this.props.step, newFret)
            } else {
                this.props.note.fret = newFret
            }
        }
        this.props.playStep(this.props.step)
        this.forceUpdate()
    }

    /**
     * Called upon a click on a textbox.
     */
    onClick() {
        this.props.playStep(this.props.step)
    }

    /**
     * Renders the EditableNote.
     */
    render() {
        let className = "editorTextbox"
        if (this.props.active) {
            className += " editorTextboxActive"
        }

        let value = ''
        if (this.props.note !== null) {
            value = this.props.note.fret
        }

        return (
            <input
                    type="text"
                    className={ className }
                    value={ value }
                    onChange={ this.onChange }
                    onClick={ this.onClick } />
        )
    }
}

export default EditableNote
