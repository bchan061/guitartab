import React from 'react'
import SoundUtilities from '../../utilities/SoundUtilities';

class Stats extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            expectedKey: "",
            noteOccurences: [],
            ready: false
        }

        this.analyzeTab = this.analyzeTab.bind(this)
        this.renderStats = this.renderStats.bind(this)
        this.renderNoteOccurences = this.renderNoteOccurences.bind(this)
    }

    /**
     * Analyzes the tab.
     */
    analyzeTab() {
        let expectedKey = ""
        let notes = []
        /* 12 keys in a octave. */
        for (let i = 0; i < 12; i++) {
            notes[i] = 0
        }

        /* Aggregate all notes. */
        for (let i = 0; i < this.props.tab.measures.length; i++) {
            let currentMeasure = this.props.tab.measures[i]
            for (let stringI = 0; stringI < this.props.strings.length; stringI++) {
                let string = this.props.strings[stringI]
                let midiPitch = string.pitch
                let capo = string.capo
                for (let noteI = 0; noteI < currentMeasure.notes[stringI].length; noteI++) {
                    let note = currentMeasure.notes[stringI][noteI]
                    if (note != null) {
                        let pitch = SoundUtilities.getMIDIPitch(midiPitch, capo, note.fret)
                        notes[pitch % 12] += 1
                    }
                }
            }
        }

        let maxIndex = 0
        let max = notes[maxIndex]
        for (let i = 0; i < notes.length; i++) {
            let amount = notes[i]
            if (amount > max) {
                maxIndex = i
                max = amount
            }
        }

        expectedKey = SoundUtilities.notePitches[SoundUtilities.findMajorKey(notes)] + " Major"

        this.setState(
            function(previousState, properties)  {
                return {
                    ready: true,
                    expectedKey: expectedKey,
                    noteOccurences: notes
                }
            }
        )
    }

    renderNoteOccurences() {
        return (
            <div className="statsOccurenceTable">
                <table>
                    <tbody>
                        {
                            this.state.noteOccurences.map(
                                function(occurence, index) {
                                    return (
                                        <tr key={ index }>
                                            <td> { SoundUtilities.notePitches[index] } </td>
                                            <td>
                                                { occurence }
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    renderStats() {
        return (
            <div>
                <p> Expected key: { this.state.expectedKey } </p>
                { this.renderNoteOccurences() }
            </div>
        )
    }

    render() {
        return (
            <div className="stats">
                { this.state.ready && this.renderStats() }
                <input type="button" value="Analyze" onClick={ this.analyzeTab } />
            </div>
        )
    }
}

export default Stats
