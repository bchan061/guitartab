class SoundUtilities {
    /**
     * Returns the frequency of the note in question.
     * @param {number} note A MIDI pitch.
     * @param {number} referenceA4 The frequency of the concert A (typically 440 Hz)
     */
    static computeFrequency(note, referenceA4 = 440) {
        return referenceA4 * Math.pow(2, (note - 69) / 12)
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
