import React from 'react'
import SoundUtilities from '../../utilities/SoundUtilities';

class Stats extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            expectedKey: ""
        }

        this.analyzeTab = this.analyzeTab.bind(this)
    }

    /**
     * Analyzes the tab.
     */
    analyzeTab() {
        let expectedKey = ""
        let notes = []
        for (let i = 0; i < SoundUtilities.notePitches.length; i++) {
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
                    if (note != -1) {
                        let pitch = SoundUtilities.getMIDIPitch(midiPitch, capo, note)
                        notes[pitch % SoundUtilities.notePitches.length] += 1
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

        expectedKey = SoundUtilities.notePitches[maxIndex]

        this.setState(
            function(previousState, properties)  {
                return {
                    expectedKey: expectedKey
                }
            }
        )
    }

    render() {
        return (
            <div className="stats">
                <p> { this.state.expectedKey && "Key: " + this.state.expectedKey } </p>
                <input type="button" value="Analyze" onClick={ this.analyzeTab } />
            </div>
        )
    }
}

export default Stats
