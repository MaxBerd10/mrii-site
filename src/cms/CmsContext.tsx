import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { fetchHome, isCmsEnabled, type CmsHome } from '../api/client'
import { useLanguage } from '../i18n/LanguageContext'
import { mapCmsDoctors, setCmsDoctorProfiles } from '../data/doctors'

type CmsContextValue = {
  home: CmsHome | null
  loading: boolean
  enabled: boolean
}

const CmsContext = createContext<CmsContextValue>({
  home: null,
  loading: false,
  enabled: false,
})

export function CmsProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage()
  const enabled = isCmsEnabled()
  const [home, setHome] = useState<CmsHome | null>(null)
  const [loading, setLoading] = useState(enabled)

  useEffect(() => {
    if (!enabled) {
      setHome(null)
      setLoading(false)
      setCmsDoctorProfiles(null)
      return
    }
    let cancelled = false
    setHome(null)
    setLoading(true)
    setCmsDoctorProfiles(null)
    fetchHome(lang).then((data) => {
      if (!cancelled) {
        setHome(data)
        setLoading(false)
        // The admin decides who is listed in every language; Karakalpak keeps its hand-written
        // bios where they exist (see mapCmsDoctors).
        setCmsDoctorProfiles(data?.doctors?.length ? mapCmsDoctors(data.doctors, lang) : null)
      }
    })
    return () => {
      cancelled = true
    }
  }, [lang, enabled])

  return (
    <CmsContext.Provider value={{ home, loading, enabled }}>
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  return useContext(CmsContext)
}
