import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImageCropper from './components/Cropping'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ImageCropper/>
    </>
  )
}

export default App
