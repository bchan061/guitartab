import Fret from './Fret'

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
        this.time = (60 / bpm) * 4
        this.steps = 1
        this.notes = []

        this.createNotes()
        this.stepTime = this.calculateStepTime()
    }

    calculateStepTime() {
        return (60 / this.bpm) * (4 / this.steps)
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
        this.steps = Math.max(steps, this.steps)

        for (let i = 0; i < steps; i++) {
            let fret = stringData[i]
            /* If no fret exists, mark that section as null */
            let fretObject = null
            if (fret !== -1) {
                fretObject = new Fret(fret)
            }
            this.notes[stringI][i] = fretObject
        }
    }
}

export default Measure
