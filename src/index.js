import { createRoot } from "react-dom/client"
import { ChakraProvider } from "@chakra-ui/react"

import "./index.css"
import App from "./App"

const container = document.getElementById("container")
const root = createRoot(container)
root.render(
  <ChakraProvider>
    <App tab="home" />
  </ChakraProvider>
)
