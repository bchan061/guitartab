/**
 * A queue implementation.
 */
class Queue {
    /**
     * Creates a queue.
     */
    constructor() {
        this.items = []
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
}

export default Queue
