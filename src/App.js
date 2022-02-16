import camera from './camera'

function App() {
  const startCamera = () => {
    camera.startCamera()
  }

  const takeAPhoto = () => {
    camera.takeSnapshot()
  }

  return (
    <>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={takeAPhoto}>Take a photo</button>
    </>
  )
}

export default App
