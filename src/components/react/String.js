import React from 'react'

import SoundUtilities from './../../utilities/SoundUtilities'

class String extends React.Component {
    constructor(props) {
        super(props)

        this.pitchHz = SoundUtilities.computeFrequency(this.props.pitch)

        this.playFret = this.playFret.bind(this)
        this.isInside = this.isInside.bind(this)
    }

    /**
     * Plays a fret from a string.
     * @param {number} fret the fret of the string
     */
    playFret(fret) {
        if (this.props.sound != null) {
            let howl = this.props.sound
            let fretHz = SoundUtilities.computeFrequency(this.props.pitch + this.props.capo + fret)
            let rate = fretHz / this.pitchHz

            howl.rate(rate)
            howl.play()
        }
    }

    isInside(note) {
        return note.getLeftInPx(this.props.time, 10) < window.innerWidth
    }

    render() {
        let time = this.props.time
        let noteContainer = this.props.noteContainer
        let playFretFunction = this.playFret

        let renderedData = (
            <tr className="playerTableRow">
                <td className="playerTableName"> { this.props.name } </td>
                <td className="playerTableBridge"> </td>
                <td className="playerTableDivisor"> </td>
                {
                    noteContainer.lastPlayedNote &&
                    <td className="playerTableLastPlayed"> { noteContainer.lastPlayedNote.fret } </td>
                }
                <td className="playerTableString"> <hr/> </td>
                <td className="playerTableFrets"> 
                    {
                        noteContainer.notes &&
                        noteContainer.notes.filter(this.isInside)
                        .map(
                            function(note, i) {
                                let style = note.getStyle(time, 10)
                                if (note.willBeRemoved(time, 10)) {
                                    noteContainer.shiftNote(note)
                                    playFretFunction(note.fret)
                                }
                                return (
                                    <div
                                        className="playerFret"
                                        style={ style }
                                        key={ i }
                                    >
                                        { note.fret }
                                    </div>
                                )
                            }
                        )
                    }
                </td>
            </tr>
        )

        noteContainer.removeFirstNotes()

        return renderedData
    }
}

export default String
