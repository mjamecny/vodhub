import VodsList from './components/VodsList'
import FavsList from './components/FavsList'
import ClipsList from './components/ClipsList'
import SharedLayout from './pages/SharedLayout'
import Welcome from './components/Welcome'
import Error from './components/Error'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const App = () => {
  const favs = useSelector((state) => state.fav.favs)

  useEffect(() => {
    localStorage.setItem('favs', JSON.stringify(favs))
  }, [favs])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Welcome />} />
          <Route path="/vods" element={<VodsList />} />
          <Route path="/clips" element={<ClipsList />} />
          <Route path="/favorites" element={<FavsList />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
