import { Howl } from 'howler'

/**
 * Contains all the sounds for the app.
 */
class Sounds {
    /**
     * Initiates all the sounds.
     */
    static init() {
        Sounds.e2 = new Howl({
            src: ['sounds/e2.wav']
        })
        Sounds.a2 = new Howl({
            src: ['sounds/a2.wav']
        })
        Sounds.d3 = new Howl({
            src: ['sounds/d3.wav']
        })
        Sounds.g3 = new Howl({
            src: ['sounds/g3.wav']
        })
        Sounds.b3 = new Howl({
            src: ['sounds/b3.wav']
        })
        Sounds.e4 = new Howl({
            src: ['sounds/e4.wav']
        })
    }
}

export default Sounds
