import React from 'react'
import String from './String'

class Strings extends React.Component {
    constructor(props) {
        super(props)

        this.strings = {
            e2: <String note={40} soundURL="sounds/e2.wav"/>,
            a2: <String note={45} soundURL="sounds/a2.wav"/>
        }

    }

    render() {
        return (
            <table>
                <tbody>
                    {this.strings.a2}
                    {this.strings.e2}
                </tbody>
            </table>
        )
    }
}

export default Strings
