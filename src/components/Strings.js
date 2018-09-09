import React from 'react'
import String from './String'

class Strings extends React.Component {
    constructor(props) {
        super(props)

        this.stringRefs = {
            "0": React.createRef(),
            "1": React.createRef()
        }

        this.strings = {
            e2: <String id={0} name='E' note={40} soundURL="sounds/e2.wav" ref={ this.stringRefs["0"] } />,
            a2: <String id={1} name='A' note={45} soundURL="sounds/a2.wav" ref={ this.stringRefs["1"] } />
        }

        this.stringIDs = {
            "0": this.strings.e2,
            "1": this.strings.a2,
        }

        this.playNote = this.playNote.bind(this)
    }

    playNote(stringID, fret) {
        this.stringRefs[stringID].current.playFret(fret)
    }

    render() {
        return (
            <table>
                <tbody>
                    { this.strings.a2 }
                    { this.strings.e2 }
                </tbody>
            </table>
        )
    }
}

export default Strings
