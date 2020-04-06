--- 
title: 三数之和
date: 2019-10-20 18:37:26
sidebar: 'auto'
categories: 
 - 算法
tags: 
 - 算法
publish: true
---

**题目：**  
给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。  

注意：答案中不可以包含重复的三元组。  

```js
例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，

满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

**解题思路：**  
1、先将数组排序  
2、定义数组最左最右两个指针  
3、计算当前数字与最左指针和最右指针的和  
4、若结果等于0则将结果push到结果数组，小于0则移动左指针，大于0移动右指针  
(由于答案中不能包含重复的三元组，所以要考虑结果去重)  
5、可以在最后的结果中对二维数组去重，也可以在循环过程中跳过重复的值，方法二效率更高，所以选择方法二

```js
function threeSum(nums) {
  const newNums = nums.sort((a, b) => a > b)
  const result = []
  for (let i = 0; i < newNums.length; i++) {
    // 跳过重复数字
    if (newNums[i] === newNums[i - 1]) {
      continue
    }
    let left = i++
    let right = newNums.length
    const sum = newNums[i] + newNums[left] + newNums[right]
    while (left < right) {
      if (sum < 0) {
        left++
      } else if (sum > 0) {
        right--
      } else {
        result.push(newNums[i], newNums[left++], newNums[right--])
        // 跳过重复数字
        while (newNums[left] === newNums[left - 1]) {
          left++
        }
        // 跳过重复数字
        while (newNums[right] === newNums[right + 1]) {
          right--
        }
      }
    }
  }
  return result
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]))
```

补充二维数组去重方法：  

```js
const arr = [[-1, 0, 1], [-1, -1, 0], [-1, 0, 1]]
const result = []
const hash = {}
for (let i = 0; i < arr.length; i++) {
  if (!hash[arr[i]]) {
    result.push(arr[i])
    hash[arr[i]] = true
  }
}
console.log(result)
```
