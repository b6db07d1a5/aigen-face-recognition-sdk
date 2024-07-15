const { FilesetResolver, ObjectDetector } = require('@mediapipe/tasks-vision')

const wasmPath = 'https://aigen-sysdev-solution.s3.ap-southeast-1.amazonaws.com/model/wasm'
const modelPath = 'https://aigen-sysdev-solution.s3.ap-southeast-1.amazonaws.com/model/int_qat_idcardfilp.tflite'

export async function initializeObjectDetector() {
  const vision = await FilesetResolver.forVisionTasks(wasmPath)

  return await ObjectDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: modelPath,
    },
    scoreThreshold: 0.5,
    runningMode: 'VIDEO',
  })
}
