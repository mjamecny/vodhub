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

serviceWorkerRegistration.register()
