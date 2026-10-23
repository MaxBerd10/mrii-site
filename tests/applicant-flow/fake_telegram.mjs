// Minimal fake Telegram Bot API: records sendMessage / sendDocument calls.
import http from 'node:http'
const log = []
http.createServer((req, res) => {
  const chunks = []
  req.on('data', c => chunks.push(c))
  req.on('end', () => {
    const body = Buffer.concat(chunks)
    if (req.method === 'GET' && req.url === '/_log') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(log)) }
    if (req.method === 'POST' && req.url === '/_reset') { log.length = 0; return res.end('ok') }
    const method = req.url.split('/').pop()
    const entry = { method, bytes: body.length }
    const ct = req.headers['content-type'] || ''
    if (ct.startsWith('multipart/form-data')) {
      const text = body.toString('latin1')
      const m = /name="document"; filename="([^"]*)"/.exec(text)
      entry.filename = m && Buffer.from(m[1], 'latin1').toString('utf8')
      const chat = /name="chat_id"\r\n\r\n(\d+)/.exec(text); entry.chat_id = chat && chat[1]
      // file payload = between header end and the closing boundary
      const start = text.indexOf('\r\n\r\n', text.indexOf('name="document"')) + 4
      const boundary = ct.split('boundary=')[1]
      const end = text.indexOf('\r\n--' + boundary, start)
      entry.fileLength = end - start
    } else {
      const p = new URLSearchParams(body.toString()); entry.chat_id = p.get('chat_id'); entry.text = p.get('text')
    }
    log.push(entry)
    res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ ok: true, result: { username: 'fake_bot' } }))
  })
}).listen(8099, '127.0.0.1', () => console.log('fake telegram on 8099'))
