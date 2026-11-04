import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WhatsAppApp from './whatsapp/WhatsAppApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WhatsAppApp />
  </StrictMode>,
)
