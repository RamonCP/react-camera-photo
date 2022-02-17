import useCamera from './Camera/useCamera'
import './Camera/style.css'
import './app.css'

function App() {
  const { getVideo, takeSnapshot, closePhoto, videoRef, photoRef } = useCamera()

  return (
    <>
      <div className='container'>
        <button onClick={getVideo}>Start Camera</button>
        <button onClick={takeSnapshot}>Take a photo</button>
        <button onClick={closePhoto}>Close photo</button>
        <video ref={videoRef} />
        <canvas ref={photoRef} />
      </div>
    </>
  )
}

export default App
