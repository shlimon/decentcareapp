import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Announce from './pages/announce/announce'
import Forms from './pages/forms/Forms'
import Home from './pages/home/home'
import Resource from './pages/resource/Resource'
import Work from './pages/work/work'

function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='/announce' element={<Announce />} />
        <Route path='/work' element={<Work />} />
        <Route path='/forms' element={<Forms />} />
        <Route path='/resource' element={<Resource />} />
        <Route path='/forms/1' element={<Forms />} />
      </Route>
    </Routes>
  )
}

export default App
