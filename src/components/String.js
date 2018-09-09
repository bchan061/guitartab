import React from 'react'
import { Howl } from 'howler'
import SoundUtilities from './../utilities/SoundUtilities'

/**
 * A string.
 * 
 * Expected properties:
 *   - note: the MIDI pitch of the note
 *   - soundURL: the URL of the sound
 *   - name: the name of the note
 *   - id: the ID of the string
 */
class String extends React.Component {
    constructor(props) {
        super(props)

        this.frequency = SoundUtilities.computeFrequency(this.props.note)
        this.sound = new Howl({
            src: [this.props.soundURL]
        })

        this.playSound = this.playSound.bind(this)
        this.playDefault = this.playDefault.bind(this)
        this.playFret = this.playFret.bind(this)
    }

    playSound(note) {
        let noteFrequency = SoundUtilities.computeFrequency(note)

        let rate = noteFrequency / this.frequency

        this.sound.rate(rate)
        this.sound.play()
    }

    playFret(fret) {
        let note = this.props.note + fret
        this.playSound(note)
    }

    playDefault() {
        this.sound.rate(1.0)
        this.sound.play()
    }

    render() {
        return (
            <tr>
                <td className="stringNameContainer">
                    <div className="stringName">
                        <span onClick={ this.playDefault }>
                            { this.props.name }
                        </span>
                    </div>
                </td>
                <td className="string">
                    <hr/>
                    <div className="stringText">
                        <div onClick={ this.playDefault }> 0 </div>
                    </div>
                </td>
            </tr>
        )
    }
}

export default String
