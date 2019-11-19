const data = [
  {
    name: '1',
    children: [
      { name: '2',
        children: [
          { name: '3' },
          { name: '4',
            children: [{ name: '5' }, { name: '6' }]
          }]
      },
      { name: '7',
        children: [
          { name: '8',
            children: [{ name: '9' }]
          }] }
    ]
  }
]

// 深度遍历, 使用递归
// function getName(data) {
//   const result = []
//   data.forEach(item => {
//     const map = data => {
//       result.push(data.name)
//       data.children && data.children.forEach(child => map(child))
//     }
//     map(item)
//   })
//   return result.join(',')
// }

// 广度遍历, 创建一个执行队列, 当队列为空的时候则结束
function getName2(data) {
  const result = []
  const queue = data
  while (queue.length > 0) {
    [...queue].forEach(child => {
      queue.shift()
      result.push(child.name)
      child.children && (queue.push(...child.children))
    })
  }
  return result.join(',')
}

// console.log(getName(data))
console.log(getName2(data))
