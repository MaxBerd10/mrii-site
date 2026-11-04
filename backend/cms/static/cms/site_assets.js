(function () {
  'use strict'
  var csrf = document.querySelector('input[name=csrfmiddlewaretoken]').value

  function status(card, text, kind) {
    var el = card.querySelector('.stx-status')
    el.textContent = text
    el.className = 'stx-status ' + (kind || '')
    if (text && kind === 'ok') setTimeout(function () { if (el.textContent === text) el.textContent = '' }, 4000)
  }

  function setMedia(card, url) {
    var media = card.querySelector('img, video')
    media.src = url + (url.indexOf('?') < 0 ? '?t=' + Date.now() : '')
  }

  function send(url, form, card, okText, changed) {
    return fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRFToken': csrf }, body: form })
      .then(function (r) {
        return r.text().then(function (t) {
          var data = {}
          try { data = JSON.parse(t) } catch (e) {}
          if (r.status === 413) data.error = 'Fayl serverga sig‘maydi (juda katta). Kichikroq fayl yuklang.'
          return { ok: r.ok, data: data, status: r.status }
        })
      })
      .then(function (res) {
        if (!res.ok) { status(card, res.data.error || 'Xatolik (' + res.status + ')', 'err'); return }
        setMedia(card, res.data.url)
        card.classList.toggle('is-changed', changed)
        status(card, okText, 'ok')
      })
      .catch(function () { status(card, 'Tarmoq xatosi', 'err') })
  }

  document.addEventListener('change', function (e) {
    var input = e.target
    if (input.type !== 'file') return
    var card = input.closest('.sta-card')
    if (!card || !input.files.length) return
    var form = new FormData()
    form.append('path', card.dataset.path)
    form.append('file', input.files[0])
    status(card, 'Yuklanmoqda…')
    send(window.STA.uploadUrl, form, card, 'Almashtirildi ✓', true).then(function () { input.value = '' })
  })

  document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('sta-reset')) return
    var card = e.target.closest('.sta-card')
    if (!confirm('Asl rasm/video qaytarilsinmi?')) return
    var form = new FormData()
    form.append('path', card.dataset.path)
    status(card, 'Qaytarilmoqda…')
    send(window.STA.resetUrl, form, card, 'Asl holiga qaytdi ✓', false)
  })

  // Show real pixel size of every picture so editors can match it.
  document.querySelectorAll('.sta-card img').forEach(function (img) {
    function show() {
      var el = img.closest('.sta-card').querySelector('.sta-dim')
      if (el && img.naturalWidth) el.textContent = img.naturalWidth + '×' + img.naturalHeight
    }
    if (img.complete) show(); else img.addEventListener('load', show)
  })
})()
