class Utilities {
    static remToPx(rem) {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    }
}

export default Utilities
