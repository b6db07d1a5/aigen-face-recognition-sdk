const AIGEN = require('./aigen-face-recognition-sdk.js')

const { add, sub } = new AIGEN()

console.log('1 + 2 = ' + add(1, 2))
console.log('2 - 1 = ' + sub(2, 1))
