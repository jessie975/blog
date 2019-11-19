// const string = '12345678 123456789'
// const reg = /\B(?=(\d{3})+\b)/g
// const result = string.replace(reg, ',')
// console.log(result)

const reg = /(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)^[0-9A-Za-z]{6,12}$/
console.log(reg.test('1234567')) // false 全是数字
console.log(reg.test('abcdef')) // false 全是小写字母
console.log(reg.test('ABCDEFGH')) // false 全是大写字母
console.log(reg.test('ab23C')) // false 不足6位
console.log(reg.test('ABCDEF234')) // true 大写字母和数字
console.log(reg.test('abcdEF234')) // true 三者都有
console.log(reg.test('abcdEF234tttttttttt')) // false 超过12位
