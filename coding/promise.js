const p = Promise.resolve(1)
const p1 = new Promise(function(resolve, reject) {
  resolve(1)
})
const p2 = new Promise(function(resolve, reject) {
  resolve(p)
})
console.log(p)
console.log(p1)
console.log(p2)
