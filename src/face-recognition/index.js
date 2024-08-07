const { FilesetResolver, FaceDetector } = require('@mediapipe/tasks-vision')

const wasmPath = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
const modelAssetPath = 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

export const POSE = {
  LEFT: 'Turn_left',
  RIGHT: 'Turn_right',
  UP: 'Look_up',
  DOWN: 'Look_down',
  CENTER: 'Center',
}

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

export function detectForVideo(video, faceDetector, startTimeMs) {
  const detections = faceDetector.detectForVideo(video, startTimeMs).detections

  if (detections.length === 1) {
    const earLeft = detections[0].keypoints[5]
    const eatRight = detections[0].keypoints[4]
    const nose = detections[0].keypoints[2]

    const pitch = calculatePitch(earLeft, eatRight, nose)
    const yaw = calculateYaw(earLeft, eatRight, nose)

    const scale = 25

    const centerY = yaw < scale && yaw > -scale
    const centerX = pitch < scale && pitch > -scale

    if (pitch > scale && centerY) {
      return { pitch, yaw, pose: POSE.UP }
    } else if (pitch < -scale && centerY) {
      return { pitch, yaw, pose: POSE.DOWN }
    } else if (yaw > scale && centerX) {
      return { pitch, yaw, pose: POSE.RIGHT }
    } else if (yaw < -scale && centerX) {
      return { pitch, yaw, pose: POSE.LEFT }
    } else if (centerY && centerX && nose.x < 0.55 && nose.x > 0.45 && nose.y < 0.7 && nose.y > 0.3) {
      return { pitch, yaw, pose: POSE.CENTER }
    }

    return null
  }

  return null
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
