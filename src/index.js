const face = require('./face-recognition/face-liveness')
const objectDetection = require('./object-recognition')

module.exports = function AIGEN() {
  this.FR = face
  this.ObjectDetection = objectDetection
  this.add = (num1, num2) => num1 + num2
  this.sub = (num1, num2) => num1 - num2
}
