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

    /**
     * Calculates the time (in seconds) for each step.
     */
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

    /**
     * Changes the number of steps in the measure.
     * @param {number} newSteps the number of new steps
     */
    changeSteps(newSteps) {
        this.steps = newSteps

        for (let stringI = 0; stringI < 6; stringI++) {
            /** Slice the array down to length of max(newSteps, this.notes[stringI].length) */
            this.notes[stringI] = this.notes[stringI].slice(0, newSteps)
            for (let i = this.notes[stringI].length; i < newSteps; i++) {
                this.notes[stringI].push(null)
            }
        }

        this.stepTime = this.calculateStepTime()
    }

    /**
     * Exports the measure into an array.
     * Used to save the tab in JSON format.
     */
    export() {
        let data = []
        for (let stringI = 0; stringI < 6; stringI++) {
            data[stringI] = []
            for (let noteI = 0; noteI < this.steps; noteI++) {
                let note = this.notes[stringI][noteI]

                if (note === null) {
                    data[stringI][noteI] = -1
                } else {
                    data[stringI][noteI] = note.fret
                }
            }
        }

        return data
    }
}

export default Measure
