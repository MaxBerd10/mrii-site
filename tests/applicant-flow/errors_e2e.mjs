import { chromium } from 'playwright'
import fs from 'node:fs'
const labels = { uz: ['Ism familiya', 'Telefon', /Arizani yuborish/], ru: ['ФИО', 'Телефон', /Отправить заявку/], en: ['Full name', 'Phone', /Submit application/], kaa: ['Atı-jóni', 'Telefon', /Arizanı jiberiw/] }
const b = await chromium.launch()
let pass = 0, fail = 0
const check = (ok, label, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${label} ${extra}`) }
for (const lang of ['uz', 'ru', 'en', 'kaa']) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } })
  await ctx.addInitScript(l => localStorage.setItem('fjsti-lang', l), lang)
  const p = await ctx.newPage()
  const errs = []; p.on('pageerror', e => errs.push(e.message))
  const [nameL, phoneL, btn] = labels[lang]
  const fill = async () => {
    await p.goto('http://localhost:8443/vakansiyalar', { waitUntil: 'networkidle' }); await p.waitForTimeout(300)
    const form = p.locator('form.vacancies-form')
    // label text differs by language: use the input positions instead (name, phone are the first two)
    await form.locator('input[type=text]').first().fill('Test Nomzod'); await form.locator('input[type=tel]').fill('+998901234567')
    return form
  }
  const errorText = async () => { await p.waitForSelector('.vacancies-form__error, .vacancies-form__success', { timeout: 15000 }); return (await p.locator('.vacancies-form__error').count()) ? p.locator('.vacancies-form__error').innerText() : 'SUCCESS:' + await p.locator('.vacancies-form__success').innerText() }
  const submit = form => form.locator('button[type=submit]').click()

  let form = await fill()
  // 1) real success, in this language
  await form.locator('input[type=file]').setInputFiles({ name: 'foto.jpg', mimeType: 'image/jpeg', buffer: fs.readFileSync(new URL('./fx/jpg_photo.bin', import.meta.url)) }); await submit(form)
  check((await errorText()).startsWith('SUCCESS:'), `[${lang}] photo of a CV is accepted`)
  // 2) client-side rejection of an .exe
  form = await fill(); await form.locator('input[type=file]').setInputFiles({ name: 'virus.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('MZ') })
  const rej = await p.locator('.vacancies-form__error').innerText(); check(/10\s?(MB|МБ)|10MB/.test(rej), `[${lang}] .exe rejected with message`, `"${rej.slice(0, 55)}…"`)
  // 3) server answers 429 / 413 / 500 / network down
  for (const [name, handler, expect] of [
    ['429 too many', r => r.fulfill({ status: 429, contentType: 'application/json', body: '{"detail":"Request was throttled."}' }), /(Juda ko|Слишком много|Too many|Júdá kóp)/],
    ['413 nginx page', r => r.fulfill({ status: 413, contentType: 'text/html', body: '<html>413 Request Entity Too Large</html>' }), /(10\s?(MB|МБ))/],
    ['500 server error', r => r.fulfill({ status: 500, contentType: 'text/html', body: 'oops' }), /(Yuborishda xatolik|Ошибка отправки|Could not submit|Jiberiwde qátelik)/],
    ['network down', r => r.abort(), /(Yuborishda xatolik|Ошибка отправки|Could not submit|Jiberiwde qátelik)/],
  ]) {
    form = await fill(); await p.route('**/api/inquiries/', handler)
    await form.locator('input[type=file]').setInputFiles({ name: 'cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 x') }); await submit(form)
    const t = await errorText(); check(expect.test(t), `[${lang}] ${name} → friendly message`, `"${t.slice(0, 60)}"`)
    await p.unroute('**/api/inquiries/')
  }
  // 4) the form still works afterwards (no stuck "sending" state)
  form = await fill(); await submit(form); check((await errorText()).startsWith('SUCCESS:'), `[${lang}] form usable again after errors`)
  if (errs.length) console.log('   js errors', errs)
  await ctx.close()
}
console.log(`\n${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0)
