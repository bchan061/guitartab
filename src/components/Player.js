import React from 'react'
import Tab from './Tab'
import Strings from './Strings'

class Player extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playing: false,
            startTimestamp: null,
        }

        this.tab = new Tab(this.props.data)
        this.stringsRef = React.createRef()
        this.strings = <Strings ref={ this.stringsRef }/>

        this.tick = this.tick.bind(this)
        this.play = this.play.bind(this)
        this.stop = this.stop.bind(this)
    }

    tick(timestamp) {
        if (this.state.playing) {
            if (!this.state.startTimestamp) {
                this.setState(
                    function(previousState, properties) {
                        return {
                            startTimestamp: timestamp
                        }
                    }
                )
            }

            let elapsed = timestamp - this.state.startTimestamp

            if (!this.tab.queue.isEmpty()) {
                let nextNote = this.tab.queue.peek()
                while(nextNote && nextNote.time <= elapsed) {
                    this.tab.queue.pop()

                    this.stringsRef.current.playNote(nextNote["string"], nextNote["fret"])

                    nextNote = this.tab.queue.peek()
                }
            } else {
                this.stop()
            }
            
            window.requestAnimationFrame(this.tick)
        }
    }

    play() {
        if (!this.state.playing) {
            window.requestAnimationFrame(this.tick)
            this.setState(
                function(previousState, properties) {
                    return {
                        playing: true
                    }
                }
            )
        }
    }

    stop() {
        console.log("Stopping")
        this.setState(
            function(previousState, properties) {
                return {
                    playing: false,
                    startTimestamp: null
                }
            }
        )

        this.tab.resetQueue()
    }

    render() {
        return (
            <div>
                { this.strings }
                <input type="button" onClick={ this.play } value="Start" />
                
            </div>
        )
    }
}

export default Player
