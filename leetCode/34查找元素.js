/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const searchRange = function(nums, target) {
  const newNums = nums.sort((a, b) => a - b)
  let result = []
  let hasFlag = false
  newNums.forEach((item, index) => {
    if (item === target) {
      result.push(index)
      hasFlag = true
    }
  })
  if (!hasFlag) {
    return [-1, -1]
  }
  if (result.length < 2) {
    result.push(result[0])
  }
  if (result.length >= 3) {
    const first = result.shift()
    const last = result.pop()
    result = [first, last]
  }
  return result
}
const nums = [3, 3, 3]
console.log(searchRange(nums, 3))
