import Measure from './Measure'
import NoteContainer from './NoteContainer';

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
        this.noteContainers = []

        this.createNoteContainers()
        this.createMeasures()
        this.collectNotes()
    }

    /**
     * Create note containers for each of the strings.
     */
    createNoteContainers() {
        for (let i = 0; i < 6; i++) {
            this.noteContainers[i] = new NoteContainer()
        }
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
     * Collects notes into the strings from all of the measures.
     */
    collectNotes() {
        for (let i = 0; i < this.measures.length; i++) {
            let measure = this.measures[i]
            for (let stringI = 0; stringI < 6; stringI++) {
                let stringNotes = measure.notes[stringI]
                this.noteContainers[stringI].addNotes(stringNotes)
            }
        }
    }
}

export default Tab
