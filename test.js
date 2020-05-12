/* eslint-disable indent */
const cache = {}
const dp = (n) => {
    if (n < 1) return 0
    if (n === 1) cache[1] = 1
    if (n === 2) cache[2] = 2

    if (cache[n]) {
        return cache[n]
    } else {
        const result = dp(n - 1) + dp(n - 2)
        cache[n] = result
        return result
    }
}

const dp2 = (n) => {
    if (n < 1) return 0
    if (n === 1) return 1
    if (n === 2) return 2
    
    let a = 1
    let b = 2
    let temp = 0
    
    for (let i = 2; i < n; i++) {
        temp = a + b
        a = b
        b = temp
    }
    return temp
}

const dp3 = (n) => {
    if (n < 1) return 0
    if (n === 1) return 1
    if (n === 2) return 2
    return dp(n - 1) + dp(n - 2)
}
console.log(dp2(10))