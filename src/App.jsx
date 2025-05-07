import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './components/Homepage';
import VideoPlayer from './components/VideoPlayer';
import SearchResults from './components/SearchResults';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router basename="/youtube">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/search/:query" element={<SearchResults />} />
      </Routes>
    </Router>
  )
}

export default App
