import useCamera from './Camera/useCamera'
import './Camera/style.css'
import './app.css'

function App() {
  const {
    getVideo,
    takeSnapshot,
    closePhoto,
    startCamera,
    hasPhoto,
    videoRef,
    photoRef
  } = useCamera()

  return (
    <>
      <div className='container'>
        {!startCamera ? (
          <button onClick={getVideo} className='start-camera'>
            Start Camera
          </button>
        ) : (
          <>
            <video ref={videoRef} />
            <button onClick={takeSnapshot} className='take'></button>

            <canvas ref={photoRef} className={hasPhoto ? 'hasPhoto' : ''} />
            <button
              onClick={closePhoto}
              className={`deletePhoto ${hasPhoto ? 'hasPhoto' : ''}`}
            ></button>
          </>
        )}
      </div>
    </>
  )
}

export default App
