import Measure from './Measure'

/**
 * A representation of tablature.
 */
class Tab {
    /**
     * Initializes a tab.
     * @param {object} data the data of the tab, in JSON
     */
    constructor(data) {
        this.data = data
        this.startOffset = 0.01

        this.constructFromData(data)
    }

    /**
     * Constructs a tab from data.
     */
    constructFromData() {
        this.title = this.data["title"]
        this.artist = this.data["artist"]
        this.tabber = this.data["tabber"]
        this.bpm = this.data["bpm"]
        this.noteData = this.data["noteData"]
        this.capo = this.data["capo"]
        this.id = this.data["id"]
        this.measures = []

        this.calculateSPM()
        this.createMeasures()
    }

    /**
     * Calculates the SPM for a new BPM.
     */
    calculateSPM() {
        let spb = 60 / this.bpm
        /* 4 beats in a measure, for now */
        let spm = spb * 4
        this.spm = spm
    }

    /**
     * Sets the new BPM for the tab.
     * @param {number} newBPM the new BPM
     */
    setBPM(newBPM) {
        this.bpm = newBPM
        this.calculateSPM()
        for (let i = 0; i < this.measures.length; i++) {
            /* Recalculate each offset and set the bpm accordingly. */
            this.measures[i].setBPM(this.bpm)
            this.measures[i].offset = (this.startOffset + (i * this.spm))
        }
    }

    /**
     * Creates measures from the note data.
     */
    createMeasures() {
        for (let i = 0; i < this.noteData.length; i++) {
            let measure = this.noteData[i]
            this.measures[i] = new Measure(this.bpm, measure, this.startOffset + i * this.spm)
        }
    }

    /**
     * Recalculates offsets for all measures, starting at the specified start.
     * @param {number} start the first measure to replace
     */
    recalculateOffsets(start) {
        for (let i = start; i < this.measures.length; i++) {
            this.measures[i].offset = (this.startOffset + (i * this.spm))
        }
    }

    /**
     * Compiles the measures into a format suitable for JSON.
     */
    compileMeasureData() {
        let data = []
        for (let i = 0; i < this.measures.length; i++) {
            data.push(this.measures[i].export())
        }
        return data
    }

    /**
     * Exports the tab into JSON.
     */
    exportToJson() {
        let object = {}
        object['title'] = this.title
        object['artist'] = this.artist
        object['tabber'] = this.tabber
        object['noteData'] = this.compileMeasureData()
        object['bpm'] = this.bpm
        object['capo'] = this.capo
        object['id'] = this.id

        return object
    }
}

export default Tab
