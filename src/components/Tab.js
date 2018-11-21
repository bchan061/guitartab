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
        this.measures = []

        this.createMeasures()
    }

    /**
     * Creates measures from the note data.
     */
    createMeasures() {
        for (let i = 0; i < this.noteData.length; i++) {
            let measure = this.noteData[i]
            let spb = 60 / this.bpm
            /* 4 beats in a measure, for now */
            let spm = spb * 4
            this.measures[i] = new Measure(this.bpm, measure, 0.01 + i * spm)
        }
    }

    /**
     * Exports the tab into JSON.
     */
    exportToJson() {
        let object = {}
        object['title'] = this.title
        object['artist'] = this.artist
    }
}

export default Tab
