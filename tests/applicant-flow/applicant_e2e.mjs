import { chromium } from 'playwright'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
const FX = fileURLToPath(new URL('./fx', import.meta.url)) // not .pathname: it percent-encodes spaces
const idx = JSON.parse(fs.readFileSync(`${FX}/index.json`, 'utf8'))
const tgLog = async () => (await fetch('http://127.0.0.1:8099/_log')).json()
await fetch('http://127.0.0.1:8099/_reset', { method: 'POST' })

const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } })
await ctx.addInitScript(() => localStorage.setItem('fjsti-lang', 'uz'))
const page = await ctx.newPage()
const jsErrors = []; page.on('pageerror', e => jsErrors.push(e.message))

async function apply(label, { name = 'Test Nomzod', phone = '+998901234567' } = {}, file) {
  await page.goto('http://localhost:8443/vakansiyalar', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const form = page.locator('form.vacancies-form')
  await form.getByLabel('Ism familiya').fill(name)
  await form.getByLabel('Telefon').fill(phone)
  let clientRejected = false
  if (file) {
    const buf = fs.readFileSync(`${FX}/${file}.bin`)
    await form.locator('input[type=file]').setInputFiles({ name: idx[file].name, mimeType: 'application/octet-stream', buffer: buf })
    await page.waitForTimeout(150)
    clientRejected = (await page.locator('.vacancies-form__error').count()) > 0
    if (clientRejected) return { outcome: 'client-rejected', msg: (await page.locator('.vacancies-form__error').innerText()).slice(0, 60) }
  }
  await form.getByRole('button', { name: /Arizani yuborish/ }).click()
  await page.waitForSelector('.vacancies-form__success, .vacancies-form__error', { timeout: 30000 })
  if (await page.locator('.vacancies-form__success').count()) {
    const t = await page.locator('.vacancies-form__success').innerText()
    return { outcome: 'ok', id: /(HR-\d{4}-[0-9A-F]{12})/.exec(t)?.[1] }
  }
  return { outcome: 'server-rejected', msg: (await page.locator('.vacancies-form__error').innerText()).slice(0, 70) }
}

const results = []
for (const [label, meta] of Object.entries(idx)) {
  const r = await apply(label, {}, label)
  const expected = meta.group === 'valid' ? 'ok' : 'rejected'
  const good = meta.group === 'valid' ? r.outcome === 'ok' : r.outcome !== 'ok'
  results.push({ label, group: meta.group, ...r, good })
  console.log(`${good ? 'PASS' : 'FAIL'}  ${meta.group.padEnd(7)} ${label.padEnd(24)} ${r.outcome.padEnd(16)} ${r.id || r.msg || ''}`)
}
// no file at all, and an application with only text
for (const [label, opts] of [['no_file', {}], ['cyrillic_name_and_uz_phone', { name: 'Алишер Валиев', phone: '90 123 45 67' }]]) {
  const r = await apply(label, opts, null); const good = r.outcome === 'ok'
  results.push({ label, good, ...r }); console.log(`${good ? 'PASS' : 'FAIL'}  extra   ${label.padEnd(24)} ${r.outcome.padEnd(16)} ${r.id || r.msg || ''}`)
}
const okCount = results.filter(r => r.outcome === 'ok').length
await new Promise(r => setTimeout(r, 2500))
const log = await tgLog()
const notifs = log.filter(e => e.method === 'sendMessage')
console.log(`\nSUMMARY: ${results.filter(r => r.good).length}/${results.length} scenarios behave correctly | accepted applications: ${okCount} | Telegram notifications received: ${notifs.length}`)
console.log('notification sample:', JSON.stringify(notifs[0]?.text?.split('\n').slice(0, 5)))
console.log('JS errors:', jsErrors)
fs.writeFileSync(new URL('./fx/applicant_results.json', import.meta.url), JSON.stringify(results, null, 1))
await b.close()
