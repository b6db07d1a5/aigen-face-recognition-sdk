const face = require('./face-recognition')
const objectDetection = require('./object-recognition')

module.exports = function AIGEN() {
  this.FR = face
  this.ObjectDetection = objectDetection
  this.FaceDetection = face
  this.exec = () => 'exec'
}
