import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/lora'
import '@fontsource-variable/manrope'
import './styles/index.css'
import { App } from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    {/* BrowserRouter gives every page a real URL, so links can be shared. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
