import { chromium } from 'playwright'
import fs from 'node:fs'
import crypto from 'node:crypto'
const BOT = '123456:LOCAL-TEST-TOKEN'
const idx = JSON.parse(fs.readFileSync(new URL('./fx/index.json', import.meta.url), 'utf8'))
const results = JSON.parse(fs.readFileSync(new URL('./fx/applicant_results.json', import.meta.url), 'utf8'))
function initData(userId, ageSec = 0) {
  const f = { auth_date: String(Math.floor(Date.now() / 1000) - ageSec), query_id: 'e2e', user: JSON.stringify({ id: userId, first_name: 'T' }) }
  const dcs = Object.keys(f).sort().map(k => `${k}=${f[k]}`).join('\n')
  f.hash = crypto.createHmac('sha256', crypto.createHmac('sha256', 'WebAppData').update(BOT).digest()).update(dcs).digest('hex')
  return new URLSearchParams(f).toString()
}
const API = 'http://127.0.0.1:8001/api/hr'
const call = (path, init = {}, data = initData(777)) => fetch(API + path, { ...init, headers: { Authorization: 'tma ' + data, ...(init.body ? { 'content-type': 'application/json' } : {}) } })
let pass = 0, fail = 0
const check = (ok, label, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} ${extra}`) }

// ---- A) every accepted resume reaches the HR chat with the exact file
await fetch('http://127.0.0.1:8099/_reset', { method: 'POST' })
const apps = await (await call('/applications/?limit=100')).json()
const byId = Object.fromEntries(apps.map(a => [a.request_id, a]))
let sent = 0
for (const r of results.filter(x => x.outcome === 'ok' && x.group === 'valid')) {
  const app = byId[r.id]
  if (!app) { check(false, `app present ${r.label}`); continue }
  const before = (await (await fetch('http://127.0.0.1:8099/_log')).json()).filter(e => e.method === 'sendDocument').length
  const res = await call(`/applications/${app.id}/resume/`, { method: 'POST' })
  const docs = (await (await fetch('http://127.0.0.1:8099/_log')).json()).filter(e => e.method === 'sendDocument')
  const last = docs[docs.length - 1]
  const ext = idx[r.label].name.split('.').pop().toLowerCase()
  const ok = res.status === 200 && docs.length === before + 1 && last.chat_id === '777' && last.filename.endsWith('.' + ext) && last.fileLength === idx[r.label].size
  check(ok, `resume→Telegram ${r.label.padEnd(22)}`, `${last?.filename} (${last?.fileLength}/${idx[r.label].size} bytes)`)
  if (ok) sent++
}
const noFile = apps.find(a => !a.has_resume)
const nf = await call(`/applications/${noFile.id}/resume/`, { method: 'POST' })
check(nf.status === 400, 'application without a file → clear 400 (button disabled in UI)')

// ---- B) auth edge cases
check((await call('/me/', {}, initData(777, 4 * 3600))).status === 200, 'session 4h old still valid')
check((await call('/me/', {}, initData(777, 7 * 3600))).status === 401, 'session 7h old → 401 (reopen app)')
check((await call('/me/', {}, initData(424242))).status === 403, 'unknown Telegram id → 403')
check((await call('/me/', {}, initData(777).replace(/hash=[0-9a-f]+/, 'hash=' + '0'.repeat(64)))).status === 401, 'forged hash → 401')

// ---- C) XSS / weird text in vacancies stays inert everywhere
for (const v of await (await call('/vacancies/')).json()) if (v.title.includes('<img')) await call(`/vacancies/${v.id}/`, { method: 'DELETE' })
const evil = { title: '<img src=x onerror=window.__pwned=1>Terapevt', department: '<script>window.__pwned=1</script>', description: '"><svg onload=window.__pwned=1>', requirements: ['<b>bold</b>', "o'g'il & qiz"], category: 'doctor' }
const created = await (await call('/vacancies/', { method: 'POST', body: JSON.stringify(evil) })).json()
const b = await chromium.launch()
const mk = async (userId, w = 390, h = 844, ageSec = 0) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 })
  await ctx.addInitScript(([d, uid]) => { window.Telegram = { WebApp: { initData: d, initDataUnsafe: { user: { id: uid } }, ready() {}, expand() {}, showConfirm(m, cb) { cb(true) } } } }, [initData(userId, ageSec), userId])
  const p = await ctx.newPage(); p.on('dialog', d => { window.__dialog = d.message(); d.dismiss() }); return { p, ctx }
}
let { p, ctx } = await mk(777)
await p.goto('http://localhost:8443/hr', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200)
check((await p.locator('.hr-card h2').first().innerText()).includes('<img src=x'), 'Mini App shows evil title as plain text', '')
check(!(await p.evaluate(() => window.__pwned)), 'no script executed in Mini App')
await ctx.close()
;({ p, ctx } = await mk(777, 1280, 900)); await ctx.addInitScript(() => localStorage.setItem('fjsti-lang', 'uz'))
await p.goto('http://localhost:8443/vakansiyalar', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
const pageText = await p.locator('.vacancies-page').innerText()
check(pageText.includes('<img src=x onerror') && !(await p.evaluate(() => window.__pwned)), 'public /vakansiyalar renders evil text inertly')
await ctx.close()
await call(`/vacancies/${created.id}/`, { method: 'DELETE' })

// ---- D) UI states
;({ p, ctx } = await mk(555)); await p.goto('http://localhost:8443/hr', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000)
check((await p.locator('.hr-note').innerText()).includes('Telegram ID: 555'), 'not-allowed user sees their Telegram ID'); await ctx.close()
;({ p, ctx } = await mk(777, 390, 844, 7 * 3600)); await p.goto('http://localhost:8443/hr', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000)
check((await p.locator('.hr-note').innerText()).includes('eskirgan'), 'expired session tells HR to reopen'); await ctx.close()
;({ p, ctx } = await mk(777)); await p.goto('http://localhost:8443/hr?tab=apps', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
check(await p.getByRole('tab', { name: /Arizalar/ }).getAttribute('aria-selected') === 'true', 'deep link ?tab=apps opens applications')
const cards = await p.locator('.hr-card').count()
check(cards >= 20, `applications list renders ${cards} cards`)
const disabled = await p.locator('button:has-text("Rezyume yo‘q")').first().isDisabled()
check(disabled, 'no-resume application has disabled resume button')
// backend goes away -> friendly toast, no crash
await p.route('**/api/hr/**', r => r.abort())
await p.getByRole('button', { name: 'Bog‘lanildi' }).first().click(); await p.waitForTimeout(800)
check((await p.locator('.hr-toast').count()) > 0, 'network failure shows a toast instead of crashing')
await ctx.close(); await b.close()
console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
