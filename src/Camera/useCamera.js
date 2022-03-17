import { useState, useRef, useEffect } from 'react'
import Quagga from 'quagga'

const readers = [
  'code_128_reader',
  'ean_reader',
  'ean_8_reader',
  'code_39_reader',
  'code_39_vin_reader',
  'codabar_reader',
  'upc_reader',
  'upc_e_reader',
  'i2of5_reader',
  '2of5_reader',
  'code_93_reader'
]

const useCamera = () => {
  const [hasPhoto, setHasPhoto] = useState(false)
  const [startCamera, setStartCamera] = useState(false)
  const videoRef = useRef(null)
  const photoRef = useRef(null)
  const [blob, setBlob] = useState(null)
  const config = {
    audio: false,
    video: { facingMode: 'user' } //{ exact: 'environment' }
  }

  const getVideo = async () => {
    config.video.facingMode = detectMobileDevice()
      ? { exact: 'environment' }
      : 'user'

    navigator.mediaDevices
      .getUserMedia(config)
      .then(handleGetVideoSuccess)
      .catch(handleGetVideoError)
  }

  const handleGetVideoSuccess = (stream) => {
    setStartCamera(true)

    let video = videoRef.current
    video.srcObject = stream
    video.play()
  }

  const handleGetVideoError = (err) => console.error(err)

  const takeSnapshot = () => {
    const width = 680
    const height = 382

    const video = videoRef.current
    const photo = photoRef.current

    photo.width = width
    photo.height = height

    const ctx = photo.getContext('2d')
    ctx.drawImage(video, 0, 0, width, height)

    const base64 = photo.toDataURL('image/jpeg')
    setHasPhoto(true)
    console.log(base64)

    photo.toBlob(function (blob) {
      const url = URL.createObjectURL(blob)
      console.log('Blob: ', url)
      setBlob(url)
    })

    console.log(photo)
  }

  const closePhoto = () => {
    const photo = photoRef.current
    const ctx = photo.getContext('2d')

    ctx.clearRect(0, 0, photo.width, photo.height)
    setHasPhoto(false)
  }

  const detectMobileDevice = () => {
    return window.innerWidth <= 800 && window.innerHeight <= 600
  }

  const drawPath = (path, def, ctx, style) => {
    ctx.strokeStyle = style.color
    ctx.fillStyle = style.color
    ctx.lineWidth = style.lineWidth
    ctx.beginPath()
    ctx.moveTo(path[0][def.x], path[0][def.y])
    for (var j = 1; j < path.length; j++) {
      ctx.lineTo(path[j][def.x], path[j][def.y])
    }
    ctx.closePath()
    ctx.stroke()
  }

  useEffect(() => {
    if (hasPhoto && blob) {
      Quagga.decodeSingle(
        {
          src: blob,
          numOfWorkers: 0, // Needs to be 0 when used within node
          inputStream: {
            size: 800 // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
            readers // List of active readers
          }
        },
        function (result) {
          if (result) {
            var drawingCtx = photoRef.current.getContext('2d')

            console.log('result: ', result)
            if (result.boxes) {
              result.boxes
                .filter(function (box) {
                  return box !== result.box
                })
                .forEach(function (box) {
                  console.log(box)

                  drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                    color: 'green',
                    lineWidth: 2
                  })
                })
              alert('barcode detected')
            }
          } else {
            alert('barcode not detected')
          }
        }
      )
    }
  }, [hasPhoto, blob])

  return {
    getVideo,
    takeSnapshot,
    closePhoto,
    startCamera,
    hasPhoto,
    videoRef,
    photoRef
  }
}

export default useCamera
