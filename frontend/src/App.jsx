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
import Register from './components/Register'
import Login from './components/Login'
import ResetPasswordForm from './components/ResetPasswordForm'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { refreshApi } from './utils'

const App = () => {
  return (
    <AuthProvider
      authType={'localstorage'}
      authName={'_auth'}
      refresh={refreshApi}
      cookieDomain={window.location.hostname}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Welcome />} />
            <Route
              path="/vods"
              element={
                <RequireAuth loginPath={'/login'}>
                  <VodsList />
                </RequireAuth>
              }
            />
            <Route
              path="/clips"
              element={
                <RequireAuth loginPath={'/login'}>
                  <ClipsList />
                </RequireAuth>
              }
            />
            <Route
              path="/streamers"
              element={
                <RequireAuth loginPath={'/login'}>
                  <StreamersList />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/resetPassword/:token"
              element={<ResetPasswordForm />}
            />
            <Route
              path="/favorites/vods"
              element={
                <RequireAuth loginPath={'/login'}>
                  <FavsVods />
                </RequireAuth>
              }
            />
            <Route
              path="/favorites/clips"
              element={
                <RequireAuth loginPath={'/login'}>
                  <FavsClips />
                </RequireAuth>
              }
            />
            <Route
              path="/favorites/streamers"
              element={
                <RequireAuth loginPath={'/login'}>
                  <FavsStreamers />
                </RequireAuth>
              }
            />
            <Route
              path="/streamers/vods/:userId"
              element={
                <RequireAuth loginPath={'/login'}>
                  <StreamerVods />
                </RequireAuth>
              }
            />
            <Route
              path="/streamers/clips/:userId"
              element={
                <RequireAuth loginPath={'/login'}>
                  <StreamerClips />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
