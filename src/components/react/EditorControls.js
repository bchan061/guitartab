import React from 'react'
import PlayerControls from './PlayerControls';

class EditorControls extends PlayerControls {
    constructor(props) {
        super(props)
        this.changeSteps = this.changeSteps.bind(this)
    }

    /**
     * Sanitizes the amount of steps.
     * @param {number} value the new amount of steps
     */
    sanitizeSteps(value) {
        return Math.max(Math.min(32, value), 0)
    }

    /**
     * Changes the steps on the measure.
     */
    changeSteps(event) {
        this.props.onChangeSteps(this.sanitizeSteps(event.target.value))
    }

    renderSongTools() {
        let playPause = "Play"
        if (this.props.playing) {
            playPause = "Pause"
        }
        return (
            <span className="playerControlsButtons">
                <p>Song Tools</p> 
                <div>
                    <button className="playerControlsButton" onClick={ this.props.onPlayPause }>{ playPause }</button>
                    <button className="playerControlsButton" onClick={ this.props.onRestart }>Restart</button>
                    <button className="playerControlsButton" onClick={ this.props.onSave }>Save</button>
                    <br/>
                    <p>
                        Capo:
                        <input
                            className="playerControlsTextbox"
                            type="number"
                            value={ this.props.tab.capo }
                            onChange={ this.onChangeCapo }
                        />
                    </p> 
                </div>
            </span>
        )
    }
    
    renderMeasureTools() {
        return (
        <span className="playerControlsArrows">
            <p> Measure Tools </p>
            <b> Measure { this.props.currentMeasure + 1 }</b>
            <div>
                <button
                    className="playerControlsArrow"
                    onClick={ this.props.onLeft }
                    disabled={ !this.props.activeLeft }
                >
                    &lt;
                </button>
                <button
                    className="playerControlsArrow"
                    onClick={ this.props.onRight }
                >
                    &gt;
                </button>
                <button
                    className="playerControlsArrow"
                    onClick={ this.props.onDelete }
                >
                    Delete
                </button>
            </div>
            <p>
                Steps:
                <input
                    className="playerControlsTextbox"
                    type="number"
                    value={ this.props.tab.measures[this.props.currentMeasure].steps }
                    onChange={ this.changeSteps }
                />
            </p>
        </span>
        )
    }
}

export default EditorControls
