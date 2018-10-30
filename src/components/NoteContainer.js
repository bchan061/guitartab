/**
 * A container for notes.
 * Should be one for each string.
 */
class NoteContainer {
    /**
     * Initializes an empty note container.
     */
    constructor() {
        this.notes = []
        this.originalNotes = []
        this.lastPlayedNote = null

        this.notesToRemove = 0
    }

    /**
     * Adds an existing array of notes into the container.
     * @param {object} newNotes an array of notes
     */
    addNotes(newNotes) {
        this.notes = this.notes.concat(newNotes)
        this.originalNotes = this.originalNotes.concat(newNotes)
    }

    /**
     * Removes the following notes from the container.
     */
    removeFirstNotes() {
        this.notes = this.notes.slice(this.notesToRemove, this.notes.length)
        this.notesToRemove = 0
    }

    /**
     * Shifts a note as the last played note.
     * @param {object} note the note to shift
     */
    shiftNote(note) {
        this.notesToRemove++
        this.lastPlayedNote = note
    }

    /**
     * Resets the notes to contain the original notes.
     */
    reset() {
        this.notes = this.originalNotes.slice()
    }
}

export default NoteContainer