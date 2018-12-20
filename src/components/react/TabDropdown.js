import React from 'react'

class TabDropdown extends React.Component {
    constructor(props) {
        super(props)

        this.tabMap = {}

        this.onSelect = this.onSelect.bind(this)
    }

    updateTabMap() {
        this.tabMap = {}
        for (let i = 0; i < this.props.tabs.length; i++) {
            let tab = this.props.tabs[i]
            let name = tab[1] + " - " + tab[2]
            this.tabMap[name] = tab[0]
        }
    }

    onSelect(event) {
        if (event.target.value in this.tabMap) {
            this.props.onSelectTab(this.tabMap[event.target.value])
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.tabs.length !== prevProps.tabs.length) {
            this.updateTabMap()
        }
    }

    render() {
        return (
            <select
                className="dropdownList"
                onChange={ this.onSelect }
                defaultValue="-1"
            >
                <option value="-1" disabled hidden> Choose a tab... </option>
                {
                    this.props.tabs && this.props.tabs.map(
                        function(tab, i) {
                            return (
                                <option key={i} value={ tab.id }>{ tab[1] + " - " + tab[2] }</option>
                            )
                        }
                    )
                }
            </select>
        )
    }
}

export default TabDropdown
