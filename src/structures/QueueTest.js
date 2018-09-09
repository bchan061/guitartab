import React from 'react'
import Queue from './Queue'

class QueueTest extends React.Component {
    constructor(props) {
        super(props)
        this.tests = []

        this.addTests = this.addTests.bind(this)
        this.addTest = this.addTest.bind(this)

        this.addTests()
    }

    addTests() {
        this.addTest(function() {
            let queue = Queue()
            queue.enqueue(1)

            let item = queue.pop()
            if (item !== 1) {
                console.log("Expected 1, got " + item)
                return false;
            }

            return true;
        })
    }

    addTest(test) {
        console.log(test)
        this.tests.push(test)
    }

    render() {
        console.log("Rendering QueueTest.")
        
        let success = true
        let testCounter = 0
        for(let test in this.tests) {
            if (test instanceof Function) {
                if (!test()) {
                    success = false
                    break
                }
                testCounter++
            }
        }

        if (success) {
            return (
                <p> All { testCounter } tests passed. </p>
            )
        }
        else {
            return (
                <p> Test { testCounter } failed. See the console for any information. </p> 
            )
        }
    }
}

export default QueueTest
