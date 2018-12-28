class SoundUtilities {
    static flatUnicode = '\u266D'
    static notePitches = [
        "C", "D" + SoundUtilities.flatUnicode,
        "D", "E" + SoundUtilities.flatUnicode,
        "E",
        "F", "G" + SoundUtilities.flatUnicode,
        "G", "A" + SoundUtilities.flatUnicode,
        "A", "B" + SoundUtilities.flatUnicode,
        "B"
    ]

    /**
     * Returns the frequency of the note in question.
     * @param {number} note A MIDI pitch.
     * @param {number} referenceA4 The frequency of the concert A (typically 440 Hz)
     */
    static computeFrequency(note, referenceA4 = 440) {
        return referenceA4 * Math.pow(2, (note - 69) / 12)
    }

    /**
     * Returns the MIDI pitch associated with the note.
     * @param {number} string the string
     * @param {number} capo the capo of the string
     * @param {number} fret the fret of the note
     */
    static getMIDIPitch(string, capo, fret) {
        return string + capo + fret
    }

    /**
     * Returns a major scale created from the associated note, in number representation.
     * @param {number} note the number associated with the note (0 - 12)
     */
    static createMajorScaleFromNote(note) {
        /*
         * From original note: W W H W W W H
         * where W = whole step
         *       H = half step
         */

        
    }

    /**
     * Converts the MIDI pitch of the note into one of the 12 keys.
     * @param {number} midiPitch the MIDI pitch of the note
     */
    static convertMIDIPitchToNote(midiPitch) {
        return SoundUtilities.notePitches[midiPitch % SoundUtilities.notePitches.length]
    }

    /**
     * Returns the time (in milliseconds) elapsed from 1 beat.
     * @param {number} bpm The beats per minute.
     */
    static bpmToMilliseconds(bpm) {
        return 60 * 1000 / bpm
    }
}

export default SoundUtilities
