/**
 * 1
 */

const origin = 'ATATAA'
const target = 'TTAATT'

const findIndex = (origin, target) => {
  const oArr = origin.split('')
  const tArr = target.split('')
  const indexArr = []
  for (let i = 0; i < oArr.length; i++) {
    if (oArr[i] !== tArr[i]) {
      indexArr.push(i)
    }
  }
  return indexArr
}

const getReault = (origin, target) => {
  const indexArr = findIndex(origin, target)
  if (indexArr.length % 2 === 0) {
    return indexArr.length / 2
  } else {
    return Math.floor(indexArr.length / 2 + 1)
  }
}

// getReault(origin, target)

/**
 * 2
 */
const yes = 2
const no = 3

/**
 * 获取可抽取次数
 * @param {Number} sum 总票数
 */
const getTimes = (sum) => {
  if (sum < 0) return 0
  if (sum < 3) return 1
  return sum % 3 === 0 ? sum / 3 : Math.floor(sum / 3 + 1)
}

/**
 * 排列组合函数
 * @param {Array} keys 需要排列组合的数组
 */

const GetDataList = (keys, currentIndex = 0, choseArr = [], result = []) => {
  const mLen = keys.length
  // 可选数量小于项所需元素的个数，则递归终止
  if (currentIndex + mLen > mLen) {
    return
  }
  for (let i = currentIndex; i < mLen; i++) {
    // n === 1的时候，说明choseArr在添加一个元素，就能生成一个新的完整项了。
    // debugger
    if (mLen === 1) {
      // 再增加一个元素就能生成一个完整项，再加入到结果集合中
      result.push([...choseArr, keys[i]])
      // 继续下一个元素生成一个新的完整项
      i + 1 < mLen && GetDataList(keys, i + 1, choseArr, result)
      break
    }
    // 执行到这，说明n > 2，choseArr还需要两个以上的元素，才能生成一个新的完整项。则递归，往choseArr添加元素
    GetDataList(keys, i + 1, [...choseArr, keys[i]], result)
  }
  return result
}

/**
 * 获取中奖与不中奖可能组成的数组，1代表中奖，0代表未中奖
 * @param {Number} yes 中奖
 * @param {Number} no 不中奖
 */
const getArray = (yes, no) => {
  const yesArr = Array.from({ length: yes }).fill(1)
  const noArr = Array.from({ length: no }).fill(0)
  const tempArr = [...yesArr, ...noArr]
  return GetDataList(tempArr)
}

// console.log(getArray(yes, no))

const quickSort = (arr) => {
  if (arr.length < 1) return arr
  const midValue = arr.splice(Math.floor(arr.length / 2), 1)[0]
  const left = []
  const right = []
  arr.forEach((item) => {
    item > midValue ? right.push(item) : left.push(item)
  })
  return [...quickSort(left), midValue, ...quickSort(right)]
}

console.log(quickSort([2, 5, 4, 3, 1]))

