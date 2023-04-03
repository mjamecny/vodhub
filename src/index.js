import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import './index.css'
import App from './App'

const container = document.getElementById('result')
const root = createRoot(container)
root.render(
  <ChakraProvider>
    <App tab="home" />
  </ChakraProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()
