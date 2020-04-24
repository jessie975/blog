const a = [1, 3, 5, 7]
const b = [2, 4, 6, 8, 9, 10]
const merge = (a, b) => {
  const result = []
  while (a.length && b.length) {
    if (a[0] <= b[0]) {
      result.push(a.shift())
    } else {
      result.push(b.shift())
    }
  }
  // 如果还有没有比较的就直接放入数组后面
  while (a.length) {
    result.push(a.shift())
  }
  while (b.length) {
    result.push(b.shift())
  }
  return result
}
// console.log(merge(a, b))

const merge1 = (a, b) => {
  let i = a.length - 1 // a数组的最后一个元素
  let j = b.length - 1 // b数组的最后一个元素
  let sum = i + j + 1 // 两个数组的总长度
  while (i >= 0 && j >= 0) {
    if (a[i] > b[j]) {
      a[sum] = a[i]
      i -= 1
    } else {
      a[sum] = b[j]
      j -= 1
    }
    sum -= 1
  }
  return a
}
// console.log(merge1(a, b))
const mergeSort = (array) => {
  if (array.length < 2) return array
  const midleIndex = Math.floor(array.length / 2)
  const left = array.slice(0, midleIndex)
  const right = array.slice(midleIndex)
  return merge(mergeSort(left), mergeSort(right))
}
const arr = [2, 5, 1, 6, 9]
console.log(mergeSort(arr))


