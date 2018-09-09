/**
 * A queue implementation.
 */
class Queue {
    /**
     * Creates a queue.
     */
    constructor() {
        this.items = []

        this.enqueue = this.enqueue.bind(this)
        this.enqueueAll = this.enqueueAll.bind(this)
        this.peek = this.peek.bind(this)
        this.pop = this.pop.bind(this)
        this.size = this.size.bind(this)
        this.isEmpty = this.isEmpty.bind(this)
    }

    /**
     * Queues the item.
     * 
     * @param {*} item the item to queue
     */
    enqueue(item) {
        this.items.push(item)
    }

    /**
     * Queues multiple items together.
     * @param {array} items the items to queue
     */
    enqueueAll(items) {
        this.items = this.items.concat(items)
    }

    /**
     * Returns the item on the queue without removing it.
     * 
     * @returns the current item in the queue
     */
    peek() {
        return this.items[0]
    }

    /**
     * Pops the item on the queue and shifts the remaining item.
     * 
     * @returns the current item in the queue
     */
    pop() {
        return this.items.shift()
    }

    /**
     * Returns the length of the queue.
     * 
     * @returns the length of the queue
     */
    size() {
        return this.items.length
    }

    /**
     * Returns whether the queue was empty.
     * 
     * @returns whether the queue was empty
     */
    isEmpty() {
        return this.size() === 0
    }
}

export default Queue
