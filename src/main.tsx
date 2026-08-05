import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import { CmsProvider } from './cms/CmsContext'
import './styles/index.css'
import './styles/motion.css'
import { markSafariDocument } from './lib/browser'

markSafariDocument()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <CmsProvider>
        <App />
      </CmsProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
