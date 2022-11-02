const AIGEN = require('./aigen-sdk.js')

const { add, sub, FR } = new AIGEN()

console.log(FR.actions.Turn_left)
console.log('1 + 2 = ' + add(1, 2))
console.log('2 - 1 = ' + sub(2, 1))
