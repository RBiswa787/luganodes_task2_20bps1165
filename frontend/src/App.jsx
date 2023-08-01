import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Landing from './pages/Landing'
import Main from './pages/Main'
function App() {

  return (
    <>
      <Routes>
          <Route path={"/"} element={<Landing></Landing>} />
          <Route path={"/protected"} element={<Main></Main>}/>
      </Routes>
    </>
  )
}

export default App
