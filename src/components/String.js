import React from 'react'
import { Howl } from 'howler'
import SoundUtilities from './../utilities/SoundUtilities'

/**
 * A string.
 * 
 * Expected properties:
 *   - note: the MIDI pitch of the note
 *   - soundURL: the url of the sound
 */
class String extends React.Component {
    constructor(props) {
        super(props)

        this.frequency = SoundUtilities.computeFrequency(this.props.note)
        this.sound = new Howl({
            src: [this.props.soundURL]
        })

        console.log("Called string constructor for note " + this.props.note)

        this.playSound = this.playSound.bind(this)
        this.playDefault = this.playDefault.bind(this)
    }

    playSound(note) {
        let noteFrequency = SoundUtilities.computeFrequency(this.props.note)

        let rate = noteFrequency / this.frequency

        this.sound.rate(rate)
        this.sound.play()
    }

    playDefault() {
        this.sound.rate(1.0)
        this.sound.play()
    }

    render() {
        return (
            <tr>    
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
