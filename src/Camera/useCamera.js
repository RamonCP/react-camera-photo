import { useEffect, useRef } from 'react'

const useCamera = () => {
  const videoRef = useRef(null)
  const photoRef = useRef(null)
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
      .then((stream) => {
        let video = videoRef.current
        video.srcObject = stream
        video.play()
      })
      .catch((err) => console.error(err))
  }

  const takeSnapshot = () => {
    const video = videoRef.current
    const photo = photoRef.current

    photo.width = 680
    photo.height = 480

    const ctx = photo.getContext('2d')
    ctx.drawImage(video, 0, 0, 680, 480)

    const base64 = photo.toDataURL('image/jpeg')

    console.log(base64)
  }

  const closePhoto = () => {
    const photo = photoRef.current
    const ctx = photo.getContext('2d')

    ctx.clearRect(0, 0, photo.width, photo.height)
  }

  const detectMobileDevice = () => {
    return window.innerWidth <= 800 && window.innerHeight <= 600
  }

  useEffect(() => {
    getVideo()
  }, [videoRef])

  return { getVideo, takeSnapshot, closePhoto, videoRef, photoRef }
}

export default useCamera
