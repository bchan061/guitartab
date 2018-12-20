import React, { Component } from 'react'
import './style/AppStyle.css'

import TestData from './test/TestData'

import Player from './components/react/Player'
import Editor from './components/react/Editor'
import SoundUtilities from './utilities/SoundUtilities';
import Sounds from './components/Sounds'
import TabDropdown from './components/react/TabDropdown'

class App extends Component {
    constructor(props) {
        super(props)
        Sounds.init()

        this.state = {
            tabs: [],
            tab: null
        }

        this.onSelectTab = this.onSelectTab.bind(this)
        this.getTab = this.getTab.bind(this)

        this.getTabs()
    }

    onSelectTab(id) {
        this.getTab(id)
    }

    loadTab(obj) {
        if ('tab' in obj) {
            this.setState(function(previousState, properties) {
                return {
                    tab: JSON.parse(obj['tab'])
                }
            })
        }
    }

    getTab(id) {
        const URLlink = "http://localhost:3005/getTab"
        let url = new URL(URLlink)
        url.search = new URLSearchParams({id: id})
        let loadTabFunction = this.loadTab.bind(this)
        return fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(obj) {
            loadTabFunction(obj)
        })
    }

    getTabs() {
        const URLlink = "http://localhost:3005/getAllTabs"
        let url = new URL(URLlink)
        let setStateFunction = this.setState.bind(this)
        return fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            return response.json()
        }).then(function(obj) {
            setStateFunction(function(previousState, properties) {
                return {
                    tabs: obj['tabs']
                }
            })
        })
    }

    render() {
        return (
            <div className="app">
                <TabDropdown
                    tabs={ this.state.tabs }
                    onSelectTab={ this.onSelectTab }
                />
                {
                    this.state.tab && <Editor data={ this.state.tab }/>
                }
            </div>
        )
    }
}

export default App;
