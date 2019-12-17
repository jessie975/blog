/**
 * @param {number} x
 * @return {boolean}
 */
const isPalindrome = function(x) {
  const arr = x.toString().split('')
  const arr2 = [...arr].reverse()
  console.log(arr, arr2)
  if (arr.join('') === arr2.join('')) {
    return true
  } else {
    return false
  }
}

console.log(isPalindrome(121))
