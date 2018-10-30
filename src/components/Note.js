import Utilities from './../utilities/Utilities'

class Note {
    constructor(time, fret) {
        this.time = time
        this.fret = fret
    }

    /**
     * Returns the left of the element in pixels.
     */
    getLeftInPx(playerTime, scale) {
        return (this.time - playerTime) *
                Utilities.remToPx(1) *
                scale
    }

    /**
     * Computes the style for a given time.
     * @param {*} playerTime the time of the player
     */
    getStyle(playerTime, scale) {
        let left = (this.time - playerTime) * scale
        let details = {
            left: left + "rem"
        }

        return details
    }

    /**
     * Checks if the note should be removed or not.
     * @param {number} playerTime the time of the player
     */
    willBeRemoved(playerTime, scale) {
        return this.getLeftInPx(playerTime, scale) <= Utilities.remToPx(3)
    }
}

export default Note
