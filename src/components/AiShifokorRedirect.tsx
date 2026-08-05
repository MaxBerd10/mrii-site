import { useEffect } from 'react'
import { AISHIFOKOR_URL } from '../data/aiPlatform'

/** Legacy clinic-site AI routes — live product is on aishifokor.uz. */
export default function AiShifokorRedirect() {
  useEffect(() => {
    window.location.replace(AISHIFOKOR_URL)
  }, [])

  return (
    <main className="container-main" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <p>AiShifokorga yo’naltirilmoqda…</p>
      <p>
        <a href={AISHIFOKOR_URL}>aishifokor.uz</a>
        {' · '}
        <a href="/ai">Klinika saytidagi AI bo’limi</a>
      </p>
    </main>
  )
}
