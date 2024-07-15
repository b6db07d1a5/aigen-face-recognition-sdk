const { FilesetResolver, FaceDetector } = require('@mediapipe/tasks-vision')

const wasmPath = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
const modelAssetPath = 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

export async function initializeFaceDetector() {
  const vision = await FilesetResolver.forVisionTasks(wasmPath)

  return await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath,
    },
    runningMode: 'VIDEO',
    minDetectionConfidence: 0.9,
  })
}

export function detectForVideo(faceDetector, startTimeMs) {
  const detections = faceDetector.detectForVideo(video, startTimeMs).detections

  if (detections.length === 1) {
    const earLeft = detections[0].keypoints[5]
    const eatRight = detections[0].keypoints[4]
    const nose = detections[0].keypoints[2]

    const pitch = calculatePitch(earLeft, eatRight, nose)
    const yaw = calculateYaw(earLeft, eatRight, nose)

    if (nose.x < 0.5 && nose.x > 0.3 && pitch > -10 && pitch < 10 && yaw > -10 && yaw < 10) {
      checkBestFace = true
    }
  }
}

export function calculatePitch(earLeft, earRight, nose) {
  const eyeMidpoint = { x: (earLeft.x + earRight.x) / 2, y: (earLeft.y + earRight.y) / 2 }
  const deltaY = eyeMidpoint.y - nose.y - (earRight.x - earLeft.x) / 10
  const fixedDistance = Math.abs((earLeft.x - earRight.x) / 2)
  const pitchRadians = Math.atan2(deltaY, fixedDistance)
  const pitchDegrees = pitchRadians * (180 / Math.PI)
  return pitchDegrees
}

export function calculateYaw(earLeft, earRight, nose) {
  const eyeMidpoint = { x: (earLeft.x + earRight.x) / 2, y: (earLeft.y + earRight.y) / 2 }
  const deltaX = eyeMidpoint.x - nose.x
  const fixedDistance = Math.abs((earLeft.x - earRight.x) / 2)
  const yawRadians = Math.atan2(deltaX, fixedDistance)
  const yawDegrees = yawRadians * (180 / Math.PI)
  return yawDegrees
}
