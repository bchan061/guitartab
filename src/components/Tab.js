/**
 * A class to hold a guitar tab.
 * 
 * Expected JSON data:
 *   - title: the title of the tablature
 *   - artist: the artist of the song
 *   - creator: the creator of the tablature
 *   - tuning: the tuning of the note
 *   - noteData: the data for the notes
 *     - [notes]:
 *       - string: a string ID
 *       - fret: the fret
 *       - time: the time from the beginning, in milliseconds
 */
class Tab {
    constructor(jsonData) {
        data = JSON.parse(jsonData)
        
        this.title = data['title']
        this.artist = data['artist']
        this.creator = data['creator']
        this.tuning = data['tuning']
        this.noteData = data['noteData']
    }
}
