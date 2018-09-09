import Queue from './../structures/Queue'

/**
 * A class to hold a guitar tab.
 * 
 * Expected JSON data:
 *   - title: the title of the tablature
 *   - artist: the artist of the song
 *   - creator: the creator of the tablature
 *   - noteData: array containing data for the notes
 *     - [notes]:
 *       - string: a string ID
 *       - fret: the fret
 *       - time: the time from the beginning, in milliseconds
 */
class Tab {
    constructor(jsonData) {
        let data = jsonData
        
        this.title = data['title']
        this.artist = data['artist']
        this.creator = data['creator']
        this.noteData = data['noteData']

        this.createQueue = this.createQueue.bind(this)
        this.resetQueue = this.resetQueue.bind(this)

        this.createQueue()
    }

    createQueue() {
        this.queue = new Queue()

        this.queue.enqueueAll(this.noteData)
    }

    resetQueue() {
        this.queue.enqueueAll(this.noteData)
    }
}

export default Tab
