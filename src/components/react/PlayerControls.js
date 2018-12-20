import React from 'react'

/**
 * The controls for the tab player.
 */
class PlayerControls extends React.Component {
    /**
     * Initializes the player controls.
     * @param {*} props 
     */
    constructor(props) {
        super(props)

        this.onChangeCapo = this.onChangeCapo.bind(this)
    }

    /**
     * Sanitizes a capo value so it isn't off-limits.
     * @param {number} val the capo value
     */
    sanitizeCapoValue(val) {
        return Math.min(Math.max(-5, val), 12)
    }

    /**
     * Called upon changing the capo value.
     * @param {object} event 
     */
    onChangeCapo(event) {
        this.props.onChangeCapo(this.sanitizeCapoValue(event.target.value))
    }

    /**
     * Renders the song tools.
     */
    renderSongTools() {
        let playPause = "Play"
        if (this.props.playing) {
            playPause = "Pause"
        }
        return (
            <span className="playerControlsButtons">
                <p> Song Tools </p>
                <div>
                    <button className="playerControlsButton" onClick={ this.props.onPlayPause }>{ playPause }</button>
                    <button className="playerControlsButton" onClick={ this.props.onRestart }>Restart</button>
                    <br/>
                    <p>
                        Capo: <input className="playerControlsTextbox" type="number" value={ this.props.tab.capo } onChange={ this.onChangeCapo } />
                    </p> 
                </div>
            </span>
        )
    }

    /**
     * Renders the measure tools.
     */
    renderMeasureTools() {
        return (
            <span className="playerControlsArrows">
                <div>
                    <p> Measure Tools </p>
                    <b> Measure { this.props.currentMeasure + 1 }</b>
                    <br/>
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
                        disabled={ !this.props.activeRight }
                    >
                        &gt;
                    </button>
                </div>
            </span>
        )
    }

    /**
     * Renders the controls.
     */
    render() {
        return (
            <div className="playerControls">
                { this.renderSongTools() }
                { this.renderMeasureTools() }
            </div>
        )
    }
}

export default PlayerControls
