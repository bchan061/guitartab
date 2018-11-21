import React from 'react'

/**
 * A textbox that represents a note.
 * Can be edited.
 */
class EditableNote extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)

    }

    onChange(event) {
        let textValue = event.target.value
        let newFret = parseInt(textValue)
        /* Handle blank textboxes */
        if (textValue === '') {
            newFret = null
        }

        this.props.note.fret = newFret
        this.forceUpdate()
    }

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
                    onChange={ this.onChange } />
        )
    }
}

export default EditableNote
