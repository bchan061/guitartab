import React from 'react'

class Player extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            position: 10
        }

        this.previousTimestamp = null

        this.test = this.test.bind(this)
    }

    componentDidMount() {
        window.requestAnimationFrame(this.test)
    }

    test(timestamp) {
        /* Delta time in seconds */
        let delta = 0
        if (this.previousTimestamp != null) {
            delta = timestamp - this.previousTimestamp
            /* Multiply by 1000 for seconds */
            delta /= 1000
        }
        this.setState(
            function(previousState, properties) {
                return {
                    position: previousState.position - delta
                }
            }
        )

        this.previousTimestamp = timestamp

        window.requestAnimationFrame(this.test)
    }

    render() {
        let style = {
            "left": this.state.position + "em"
        }

        return (
            <table className="playerTable">
                <tbody>
                    <tr className="playerTableRow">
                        <td className="playerTableString"> E </td>
                        <td className="playerTableDivider"></td>
                        <td className="playerTableColumn" style={style}> 2</td>
                        <td className="playerTableColumn" style={style}> 5</td>
                        <td className="playerTableColumn" style={style}> 8</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default Player
