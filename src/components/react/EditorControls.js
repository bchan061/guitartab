import React from 'react'
import PlayerControls from './PlayerControls';

class EditorControls extends PlayerControls {
    constructor(props) {
        super(props)
        this.changeSteps = this.changeSteps.bind(this)
        this.changeMeasure = this.changeMeasure.bind(this)
        this.changeBPM = this.changeBPM.bind(this)
        this.changeLoop = this.changeLoop.bind(this)
    }

    /**
     * Changes the BPM of the tab.
     * @param {*} event 
     */
    changeBPM(event) {
        this.props.onChangeBPM(Math.max(Math.min(999, event.target.value), 1))
    }

    /**
     * Sanitizes the amount of steps.
     * @param {number} value the new amount of steps
     */
    sanitizeSteps(value) {
        return Math.max(Math.min(32, value), 1)
    }

    /**
     * Changes the steps on the measure.
     */
    changeSteps(event) {
        this.props.onChangeSteps(this.sanitizeSteps(event.target.value))
    }

    /**
     * Changes the current measure.
     */
    changeMeasure(event) {
        this.props.onChangeMeasure(event.target.value)
    }

    /**
     * Changes whether the current measure should loop or not.
     */
    changeLoop(event) {
        this.props.onChangeLoop(!this.props.loop)
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
                    <p>
                        BPM:
                        <input
                            className="playerControlsTextbox"
                            type="number"
                            value={ this.props.tab.bpm }
                            onChange={ this.changeBPM }
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
            <b> Measure
                <input
                    className="playerControlsTextbox"
                    type="number"
                    onChange={ this.changeMeasure }
                    value={ this.props.currentMeasure + 1 }
                />
            </b>
            <br/>
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
            <div>
                <button
                    className="playerControlsButton"
                    onClick={ this.props.onCopy }
                >
                    Copy
                </button>
                <button
                    className="playerControlsButton"
                    disabled={ !this.props.canPaste }
                    onClick={ this.props.onPaste }
                >
                    Paste
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
            <p>
                <input
                    type="checkbox"
                    value={ this.props.loop }
                    onClick={ this.changeLoop }
                /> Loop Measure
            </p>
        </span>
        )
    }
}

export default EditorControls
