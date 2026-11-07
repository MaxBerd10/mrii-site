import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider, readCachedConfig } from './i18n/LanguageContext'
import { CmsProvider } from './cms/CmsContext'
import './styles/index.css'
import './styles/motion.css'
import { markSafariDocument } from './lib/browser'
import { setAssetOverrides } from './lib/assetOverrides'
import { installImageFallback } from './lib/imageFallback'

markSafariDocument()
installImageFallback()
// Replaced pictures from the last visit apply before the first image is requested.
setAssetOverrides(readCachedConfig()?.assets)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <CmsProvider>
        <App />
      </CmsProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
