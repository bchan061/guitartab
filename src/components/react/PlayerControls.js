import React from 'react'

/**
 * The controls for the tab player.
 */
class PlayerControls extends React.Component {
    /**
     * Renders the controls.
     */
    render() {
        let playPause = "Play"
        if (this.props.playing) {
            playPause = "Pause"
        }
        return (
            <div className="playerControls">
                <span className="playerControlsButtons">
                    <button className="playerControlsButton" onClick={ this.props.onPlayPause }>{ playPause }</button>
                    <button className="playerControlsButton" onClick={ this.props.onRestart }>Restart</button>
                </span>
                <span className="playerControlsArrows">
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
                </span>
            </div>
        )
    }
}

export default PlayerControls
