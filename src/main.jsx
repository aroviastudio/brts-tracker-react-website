import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BusinessChatbot from './BusinessChatbot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BusinessChatbot />
  </StrictMode>,
)
