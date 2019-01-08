class SoundUtilities {
    static flatUnicode = '\u266D'
    static sharpUnicode = '\u266F'
    static notePitches = [
        "C", "C" + SoundUtilities.sharpUnicode + "/D" + SoundUtilities.flatUnicode,
        "D", "D" + SoundUtilities.sharpUnicode + "/E" + SoundUtilities.flatUnicode,
        "E",
        "F", "F" + SoundUtilities.sharpUnicode + "/G" + SoundUtilities.flatUnicode,
        "G", "G" + SoundUtilities.sharpUnicode + "/A" + SoundUtilities.flatUnicode,
        "A", "A" + SoundUtilities.sharpUnicode + "/B" + SoundUtilities.flatUnicode,
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

        /* Omit last note: this is the root note raised by an octave */
        let majorStepFormula = [0, 2, 2, 1, 2, 2, 2]
        let notes = []
        let current = note
        for (let i = 0; i < majorStepFormula.length; i++) {
            current = (current + majorStepFormula[i]) % 12
            notes[i] = current
        }

        return notes
    }

    /**
     * Finds the closest (relative) major key specified by the note occurences.
     * @param {number[]} occurences the number of occurences for each pitch
     * @returns the closest major key
     */
    static findMajorKey(occurences) {
        let bestFindStrength = 0
        let bestFind = 0
        for (let i = 0; i < 12; i++) {
            let iMajorScale = SoundUtilities.createMajorScaleFromNote(i)

            /* 
             * Multiply each of the specified keys in the major scale with the occurences,
             * and add them together
            */
            let strength = 0
            for (let keyI = 0; keyI < iMajorScale.length; keyI++) {
                let pitch = iMajorScale[keyI]
                strength += (occurences[pitch])
            }

            if (strength > bestFindStrength) {
                bestFindStrength = strength
                bestFind = i
            }
        }

        return bestFind
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
