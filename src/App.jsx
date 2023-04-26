import VodsList from './components/VodsList'
import ClipsList from './components/ClipsList'
import StreamersList from './components/StreamersList'
import StreamerVods from './components/StreamerVods'
import StreamerClips from './components/StreamerClips'
import SharedLayout from './pages/SharedLayout'
import Welcome from './components/Welcome'
import Error from './components/Error'
import FavsVods from './components/FavsVods'
import FavsClips from './components/FavsClips'
import FavsStreamers from './components/FavsStreamers'

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
          <Route path="/streamers" element={<StreamersList />} />
          <Route path="/favorites/vods" element={<FavsVods />} />
          <Route path="/favorites/clips" element={<FavsClips />} />
          <Route path="/favorites/streamers" element={<FavsStreamers />} />
          <Route path="/streamers/vods/:userId" element={<StreamerVods />} />
          <Route path="/streamers/clips/:userId" element={<StreamerClips />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
