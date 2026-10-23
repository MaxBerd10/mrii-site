import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createHrClient,
  HrApiError,
  type HrApplication,
  type HrClient,
  type HrMe,
  type HrVacancy,
  type VacancyInput,
} from './hrApi'
import './hr.css'

type TgWebApp = {
  initData: string
  initDataUnsafe?: { user?: { id: number; first_name?: string } }
  ready(): void
  expand(): void
  showConfirm?(message: string, cb: (ok: boolean) => void): void
  HapticFeedback?: { notificationOccurred(type: 'success' | 'error' | 'warning'): void }
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp }
  }
}

const TELEGRAM_SCRIPT = 'https://telegram.org/js/telegram-web-app.js'

function loadTelegram(): Promise<TgWebApp | null> {
  if (window.Telegram?.WebApp) return Promise.resolve(window.Telegram.WebApp)
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = TELEGRAM_SCRIPT
    script.async = true
    const done = () => resolve(window.Telegram?.WebApp ?? null)
    script.onload = done
    script.onerror = () => resolve(null)
    document.head.appendChild(script)
    window.setTimeout(done, 5000)
  })
}

const STATUS_LABEL: Record<HrApplication['status'], string> = {
  new: 'Yangi',
  contacted: 'Bog‘lanildi',
  closed: 'Yopildi',
}

const pad = (n: number) => String(n).padStart(2, '0')

// dd.mm.yyyy regardless of the device locale
const formatDate = (iso: string | null) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

type Phase =
  | { kind: 'loading' }
  | { kind: 'outside' }
  | { kind: 'error'; message: string; telegramId?: number }
  | { kind: 'ready'; client: HrClient; me: HrMe; tg: TgWebApp }

export default function HrApp() {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' })

  useEffect(() => {
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex,nofollow'
    document.head.appendChild(robots)
    document.title = 'HR · FJSTI'
    return () => robots.remove()
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const tg = await loadTelegram()
      if (cancelled) return
      if (!tg || !tg.initData) {
        setPhase({ kind: 'outside' })
        return
      }
      tg.ready()
      tg.expand()
      try {
        const client = createHrClient(tg.initData)
        const me = await client.me()
        if (!cancelled) setPhase({ kind: 'ready', client, me, tg })
      } catch (err) {
        if (cancelled) return
        const status = err instanceof HrApiError ? err.status : 0
        const message =
          status === 403
            ? 'Sizga bu bo‘limga kirish ruxsat etilmagan. Quyidagi Telegram ID ni administratorga yuboring.'
            : status === 401
              ? 'Sessiya eskirgan. Mini Appni yopib, qayta oching.'
              : status === 503
                ? 'Telegram bot hali sozlanmagan.'
                : err instanceof Error
                  ? err.message
                  : 'Ulanishda xatolik.'
        setPhase({ kind: 'error', message, telegramId: tg.initDataUnsafe?.user?.id })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="hr-app">
      {phase.kind === 'loading' && <p className="hr-note">Yuklanmoqda…</p>}
      {phase.kind === 'outside' && (
        <div className="hr-note">
          <b>Bu sahifa Telegram ichida ochiladi.</b>
          <p>Botimizni Telegram’da oching va menyudagi «Vakansiyalar» tugmasini bosing.</p>
        </div>
      )}
      {phase.kind === 'error' && (
        <div className="hr-note hr-note--error">
          <b>{phase.message}</b>
          {phase.telegramId ? <p>Telegram ID: <code>{phase.telegramId}</code></p> : null}
        </div>
      )}
      {phase.kind === 'ready' && <HrMain client={phase.client} me={phase.me} tg={phase.tg} />}
    </div>
  )
}

function HrMain({ client, me, tg }: { client: HrClient; me: HrMe; tg: TgWebApp }) {
  const initialTab = new URLSearchParams(window.location.search).get('tab') === 'apps' ? 'apps' : 'vacancies'
  const [tab, setTab] = useState<'vacancies' | 'apps'>(initialTab)
  const [newCount, setNewCount] = useState(me.new_applications)
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null)

  const notify = useCallback(
    (text: string, error = false) => {
      setToast({ text, error })
      tg.HapticFeedback?.notificationOccurred(error ? 'error' : 'success')
      window.setTimeout(() => setToast(null), 3200)
    },
    [tg],
  )

  const confirmAsk = useCallback(
    (message: string) =>
      new Promise<boolean>((resolve) => {
        if (tg.showConfirm) tg.showConfirm(message, resolve)
        else resolve(window.confirm(message))
      }),
    [tg],
  )

  return (
    <>
      <header className="hr-head">
        <div>
          <h1>HR · {me.name || 'Xodim'}</h1>
          <p>Vakansiyalar va kelgan arizalar</p>
        </div>
      </header>

      <nav className="hr-tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'vacancies'} onClick={() => setTab('vacancies')}>
          Vakansiyalar
        </button>
        <button role="tab" aria-selected={tab === 'apps'} onClick={() => setTab('apps')}>
          Arizalar{newCount > 0 ? <span className="hr-badge">{newCount}</span> : null}
        </button>
      </nav>

      {tab === 'vacancies' ? (
        <VacanciesTab client={client} me={me} notify={notify} confirmAsk={confirmAsk} />
      ) : (
        <ApplicationsTab client={client} notify={notify} onNewCount={setNewCount} />
      )}

      {toast ? (
        <div className={`hr-toast${toast.error ? ' hr-toast--error' : ''}`} role="status">
          {toast.text}
        </div>
      ) : null}
    </>
  )
}

type TabProps = {
  client: HrClient
  notify: (text: string, error?: boolean) => void
}

function VacanciesTab({
  client,
  me,
  notify,
  confirmAsk,
}: TabProps & { me: HrMe; confirmAsk: (m: string) => Promise<boolean> }) {
  const [items, setItems] = useState<HrVacancy[] | null>(null)
  const [editing, setEditing] = useState<HrVacancy | 'new' | null>(null)

  const reload = useCallback(async () => {
    try {
      setItems(await client.vacancies())
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Yuklab bo‘lmadi', true)
      setItems([])
    }
  }, [client, notify])

  useEffect(() => {
    void reload()
  }, [reload])

  const labelOf = (choices: { value: string; label: string }[], value: string) =>
    choices.find((c) => c.value === value)?.label ?? value

  async function toggle(v: HrVacancy) {
    try {
      await client.updateVacancy(v.id, { is_active: !v.is_active })
      notify(v.is_active ? 'Vakansiya saytdan olib tashlandi' : 'Vakansiya saytda ko‘rinadi')
      await reload()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Xatolik', true)
    }
  }

  async function remove(v: HrVacancy) {
    if (!(await confirmAsk(`«${v.title}» vakansiyasi butunlay o‘chirilsinmi?`))) return
    try {
      await client.deleteVacancy(v.id)
      notify('O‘chirildi')
      await reload()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Xatolik', true)
    }
  }

  if (editing) {
    return (
      <VacancyForm
        me={me}
        initial={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSave={async (data) => {
          try {
            if (editing === 'new') await client.createVacancy(data)
            else await client.updateVacancy(editing.id, data)
            notify(editing === 'new' ? 'Vakansiya qo‘shildi' : 'Saqlandi')
            setEditing(null)
            await reload()
          } catch (err) {
            notify(err instanceof Error ? err.message : 'Saqlab bo‘lmadi', true)
          }
        }}
      />
    )
  }

  return (
    <section>
      <button className="hr-btn hr-btn--primary hr-btn--block" onClick={() => setEditing('new')}>
        + Yangi vakansiya
      </button>
      {items === null ? <p className="hr-note">Yuklanmoqda…</p> : null}
      {items?.length === 0 ? <p className="hr-note">Hozircha vakansiya yo‘q.</p> : null}
      <ul className="hr-list">
        {items?.map((v) => (
          <li key={v.id} className={`hr-card${v.is_active ? '' : ' hr-card--off'}`}>
            <div className="hr-card__top">
              <h2>{v.title}</h2>
              <span className={`hr-pill${v.is_active ? ' hr-pill--on' : ''}`}>{v.is_active ? 'Saytda' : 'Yashirin'}</span>
            </div>
            <p className="hr-meta">
              {labelOf(me.choices.category, v.category)} · {labelOf(me.choices.employment, v.employment)}
              {v.deadline ? ` · muddat ${formatDate(v.deadline)}` : ''}
            </p>
            <p className="hr-meta">{v.applications} ta ariza</p>
            <div className="hr-actions">
              <button className="hr-btn" onClick={() => setEditing(v)}>Tahrirlash</button>
              <button className="hr-btn" onClick={() => void toggle(v)}>{v.is_active ? 'Yashirish' : 'Saytga qo‘yish'}</button>
              <button className="hr-btn hr-btn--danger" onClick={() => void remove(v)}>O‘chirish</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function VacancyForm({
  me,
  initial,
  onSave,
  onCancel,
}: {
  me: HrMe
  initial: HrVacancy | null
  onSave: (data: VacancyInput) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'doctor')
  const [employment, setEmployment] = useState(initial?.employment ?? 'full_time')
  const [department, setDepartment] = useState(initial?.department ?? '')
  const [location, setLocation] = useState(initial?.location ?? 'Farg‘ona')
  const [experience, setExperience] = useState(initial?.experience ?? '')
  const [deadline, setDeadline] = useState(initial?.deadline ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [requirements, setRequirements] = useState((initial?.requirements ?? []).join('\n'))
  const [active, setActive] = useState(initial?.is_active ?? true)
  const [saving, setSaving] = useState(false)

  const valid = title.trim().length > 0

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!valid || saving) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      category,
      employment,
      department: department.trim(),
      location: location.trim(),
      experience: experience.trim(),
      deadline: deadline || null,
      description: description.trim(),
      requirements: requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      is_active: active,
    })
    setSaving(false)
  }

  return (
    <form className="hr-form" onSubmit={submit}>
      <h2>{initial ? 'Vakansiyani tahrirlash' : 'Yangi vakansiya'}</h2>

      <label>
        Lavozim *
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} placeholder="Masalan: Kardiolog" required />
      </label>

      <div className="hr-row">
        <label>
          Kategoriya
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {me.choices.category.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
        <label>
          Bandlik
          <select value={employment} onChange={(e) => setEmployment(e.target.value)}>
            {me.choices.employment.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Bo‘lim
        <input value={department} onChange={(e) => setDepartment(e.target.value)} maxLength={255} placeholder="Kardiologiya bo‘limi" />
      </label>

      <div className="hr-row">
        <label>
          Joy
          <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={255} />
        </label>
        <label>
          Tajriba
          <input value={experience} onChange={(e) => setExperience(e.target.value)} maxLength={128} placeholder="3 yildan" />
        </label>
      </div>

      <label>
        Ariza muddati
        <input type="date" value={deadline ?? ''} onChange={(e) => setDeadline(e.target.value)} />
      </label>

      <label>
        Tavsif
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={5000} />
      </label>

      <label>
        Talablar <small>(har qatorda bittadan)</small>
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={5} placeholder={'Oliy tibbiy ma’lumot\nSertifikat'} />
      </label>

      <label className="hr-check">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Saytda ko‘rsatilsin
      </label>

      <p className="hr-hint">Ruscha va inglizcha matnlar o‘zbekchadan avtomatik tarjima qilinadi (bir necha soniya ichida).</p>

      <div className="hr-bar">
        <button type="button" className="hr-btn" onClick={onCancel}>Bekor qilish</button>
        <button type="submit" className="hr-btn hr-btn--primary" disabled={!valid || saving}>
          {saving ? 'Saqlanmoqda…' : 'Saqlash'}
        </button>
      </div>
    </form>
  )
}

function ApplicationsTab({
  client,
  notify,
  onNewCount,
}: TabProps & { onNewCount: (n: number) => void }) {
  const [items, setItems] = useState<HrApplication[] | null>(null)
  const [onlyNew, setOnlyNew] = useState(false)

  const reload = useCallback(async () => {
    try {
      const rows = await client.applications(onlyNew ? 'new' : undefined)
      setItems(rows)
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Yuklab bo‘lmadi', true)
      setItems([])
    }
  }, [client, notify, onlyNew])

  useEffect(() => {
    void reload()
  }, [reload])

  const newInList = useMemo(() => (items ?? []).filter((a) => a.status === 'new').length, [items])
  useEffect(() => {
    if (items && !onlyNew) onNewCount(newInList)
  }, [items, onlyNew, newInList, onNewCount])

  async function setStatus(a: HrApplication, status: HrApplication['status']) {
    try {
      const updated = await client.setApplicationStatus(a.id, status)
      setItems((prev) => (prev ? prev.map((x) => (x.id === a.id ? updated : x)) : prev))
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Xatolik', true)
    }
  }

  async function sendResume(a: HrApplication) {
    try {
      await client.sendResume(a.id)
      notify('Rezyume Telegram chatingizga yuborildi')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Yuborib bo‘lmadi', true)
    }
  }

  return (
    <section>
      <div className="hr-chips">
        <button aria-pressed={!onlyNew} onClick={() => setOnlyNew(false)}>Hammasi</button>
        <button aria-pressed={onlyNew} onClick={() => setOnlyNew(true)}>Faqat yangi</button>
      </div>
      {items === null ? <p className="hr-note">Yuklanmoqda…</p> : null}
      {items?.length === 0 ? <p className="hr-note">Arizalar yo‘q.</p> : null}
      <ul className="hr-list">
        {items?.map((a) => (
          <li key={a.id} className="hr-card">
            <div className="hr-card__top">
              <h2>{a.name}</h2>
              <span className={`hr-pill hr-pill--${a.status}`}>{STATUS_LABEL[a.status]}</span>
            </div>
            <p className="hr-meta">{a.vacancy || 'Umumiy ariza'} · {formatDate(a.created_at)}</p>
            {a.message ? <p className="hr-msg">{a.message}</p> : null}
            <div className="hr-actions">
              <a className="hr-btn" href={`tel:${a.phone.replace(/[^+\d]/g, '')}`}>📞 {a.phone}</a>
              <button className="hr-btn" disabled={!a.has_resume} onClick={() => void sendResume(a)}>
                {a.has_resume ? '📎 Rezyume' : 'Rezyume yo‘q'}
              </button>
            </div>
            <div className="hr-seg" role="group" aria-label="Holat">
              {(Object.keys(STATUS_LABEL) as HrApplication['status'][]).map((s) => (
                <button key={s} aria-pressed={a.status === s} onClick={() => void setStatus(a, s)}>
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
