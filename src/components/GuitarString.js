import SoundUtilities from '../utilities/SoundUtilities'

class String {
    constructor(name, pitch, sound = null, capo = 0) {
        this.name = name
        this.pitch = pitch
        this.capo = capo
        this.sound = sound

        this.pitchHz = SoundUtilities.computeFrequency(this.pitch)

        this.playFret = this.playFret.bind(this)
    }

    /**
     * Plays a fret from a string.
     * @param {number} fret the fret of the string
     */
    playFret(fret) {
        if (this.sound != null) {
            let howl = this.sound
            let fretHz = SoundUtilities.computeFrequency(this.pitch + this.capo + fret)
            let rate = fretHz / this.pitchHz

            howl.rate(rate)
            howl.play()
        }
    }
}

export default String
