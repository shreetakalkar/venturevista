import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FeatureTab from './FeatureTab'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <FeatureTab/>
     </>
  )
}

export default App
