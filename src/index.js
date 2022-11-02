const face = require('./face-recognition/face-liveness')

module.exports = function AIGEN() {
  this.FR = face
  this.add = (num1, num2) => num1 + num2
  this.sub = (num1, num2) => num1 - num2
}
