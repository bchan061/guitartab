import Note from './Note'

/**
 * A measure.
 */
class Measure {
    /**
     * Initializes a measure.
     * @param {number} bpm the BPM of the measure
     * @param {object} data the data of the measure
     * @param {number} offset the time of the first note, in seconds
     */
    constructor(bpm, data, offset) {
        this.bpm = bpm
        this.data = data
        this.offset = offset
        this.notes = []

        this.createNotes()
    }

    /**
     * Creates the notes from the data.
     */
    createNotes() {
        /* this.data is segmented into 6 different strings, with high E on top and low E on bottom */
        for (let stringI = 0; stringI < 6; stringI++) {
            let stringData = this.data[stringI]

            this.notes[stringI] = []

            this.createNotesFromString(stringData, stringI)
        }
    }

    /**
     * Creates notes from a string in a tab.
     * @param {object} stringData an array representing a string.
     * @param {number} stringI the string number
     */
    createNotesFromString(stringData, stringI) {
        let steps = stringData.length
        /* 4 beats in a measure */
        let sForDivision = (60 / this.bpm) * 4 / steps

        for (let i = 0; i < steps; i++) {
            let fret = stringData[i]
            if (fret !== -1) {
                let note = new Note(i * sForDivision + this.offset, fret)

                this.notes[stringI].push(note)
            }
        }
    }
}

export default Measure
