// faceliveness utilities

export async function startLivenessDetection(args) {
  let attempt = 0
  let maxAttempt = 3

  await sleep(3000)

  const { camera } = args

  const firstImage = cameraCapture(camera)

  ;(async () => {
    let result

    while (attempt < maxAttempt) {
      attempt++
      result = await doProcess(args)
      result.attempt = attempt
      result.face = firstImage

      if (result.isAlive) {
        break
      }
    }

    args.finishCallback(result)
  })()

  async function doProcess(args) {
    const { getSequence, postLiveness, faceTracing, sequenceCallback, camera } = args

    const { request_id, next_choice } = await getSequence()

    faceTracing(next_choice)

    let frame = 0
    let maxFrame = 10 //process frame per choice
    let isAlive = false

    function setSetFrame() {
      frame = 0
    }

    function setAlive(alive) {
      isAlive = alive
    }

    while (frame < maxFrame) {
      const image = cameraCapture(camera)

      try {
        const { result, status, next_choice } = await postLiveness({
          image,
          request_id,
        })

        if (status === 'completed') {
          setAlive(true)
          //faceTracing(status)

          break
        }

        if (status === 'uncompleted') {
          setAlive(false)

          console.log('====> uncompleted')
          break
        }

        if (result === 'Yes' && status === 'processing') {
          await sleep(1500)
          setSetFrame()
          sequenceCallback({ result, status })
          faceTracing(next_choice)
        }

        if (result === 'No' && status === 'processing') {
          await sleep(1500)
          faceTracing(next_choice)
        }
      } catch (error) {
        console.log(error)
      }

      frame++
    }

    return { isAlive }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function cameraCapture(video) {
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

  //base64 data for server side **due to security issue, please encrypt base64 with any secret key before send
  return canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '')
}

export const actions = {
  Turn_left: { text: 'หันหน้าด้านซ้าย', emo: '🧑' },
  Turn_right: { text: 'หันหน้าด้านขวา', emo: '🧑' },
  Look_up: { text: 'หันหน้าขึ้นด้านบน', emo: '🧑' },
  Look_down: { text: 'หันหน้าลงด้านล่าง', emo: '🧑' },
  Open_mouth: { text: 'กรุณาอ้าปาก', emo: '👄' },
  Smile: { text: 'แสดงใบหน้ายิ้ม', emo: '😃' },
  Like_right_hand: { text: 'ยกนิ้วให้ด้วยมือขวา', emo: '👍' },
  Like_left_hand: { text: 'ยกนิ้วให้ด้วยมือซ้าย', emo: '👍' },
  I_love_you_right_hand: { text: 'แสดงว่าฉันรักคุณด้วยมือขวา', emo: '🤟' },
  I_love_you_left_hand: { text: 'แสดงว่าฉันรักคุณด้วยมือซ้าย', emo: '🤟' },
  Ok_right_hand: { text: 'แสดงเครื่องหมายโอเคด้วยมือขวา', emo: '👌' },
  Ok_left_hand: { text: 'แสดงเครื่องหมายโอเคด้วยมือขวา', emo: '👌' },
  Handful_right_hand: { text: 'แสดงกำปั้นขวา', emo: '✊' },
  Handful_left_hand: { text: 'แสดงกำปั้นซ้าย', emo: '✊' },
  One_right_hand: { text: 'แสดงหนึ่งนิ้วด้วยมือขวา', emo: '☝️' },
  One_left_hand: { text: 'แสดงหนึ่งนิ้วด้วยมือซ้าย', emo: '☝️' },
  Two_right_hand: { text: 'แสดงสองนิ้วด้วยมือขวา', emo: '✌️' },
  Two_left_hand: { text: 'แสดงสองนิ้วด้วยมือซ้าย', emo: '✌️' },
  Three_right_hand: { text: 'แสดงสามนิ้วด้วยมือขวา', emo: '✋' },
  Three_left_hand: { text: 'แสดงสามนิ้วด้วยมือซ้าย', emo: '✋' },
  Four_right_hand: { text: 'แสดงสี่นิ้วด้วยมือขวา', emo: '✋' },
  Four_left_hand: { text: 'แสดงสี่นิ้วด้วยมือซ้าย', emo: '✋' },
  Forehand_right_hand: { text: 'แสดงด้านหน้าของมือขวา', emo: '✋' },
  Forehand_left_hand: { text: 'แสดงด้านหน้าของมือซ้าย', emo: '✋' },
  Backhand_right_hand: { text: 'แสดงหลังมือขวา', emo: '🤚' },
  Backhand_left_hand: { text: 'แสดงหลังมือซ้าย', emo: '🤚' },
  Victory_right_hand: { text: 'แสดงสัญลักษณ์สองนิ้วด้วยมือขวา', emo: '✌️' },
  Victory_left_hand: { text: 'แสดงสัญลักษณ์สองนิ้วด้วยมือซ้าย', emo: '✌️' },
  Right_hand: { text: 'ยกมือขวา', emo: '🤚' },
  Left_hand: { text: 'ยกมือซ้าย', emo: '🤚' },
}

export function livenessTest() {
  return 'liveness test'
}
