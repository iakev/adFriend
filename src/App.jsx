import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import useAdCount from './hooks/useAdCount'

function App() {
  const [count, setCount] = useState(0);
  const { adCount } = useAdCount();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>AdFriend</h1>
      <div className="alert alert-info">
        <h2>Ads Detected: {adCount}</h2>
        <p className="text-sm">on this page</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App

