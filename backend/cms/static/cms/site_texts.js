(function () {
  'use strict'
  var csrf = document.querySelector('input[name=csrfmiddlewaretoken]').value

  function post(url, data) {
    return fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
      body: JSON.stringify(data),
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, data: j } })
    })
  }

  function collect(row) {
    var values = {}
    row.querySelectorAll('textarea').forEach(function (t) { values[t.dataset.lang] = t.value })
    return values
  }

  function status(row, text, kind) {
    var el = row.querySelector('.stx-status')
    el.textContent = text
    el.className = 'stx-status ' + (kind || '')
    if (text) setTimeout(function () { if (el.textContent === text) el.textContent = '' }, 4000)
  }

  function markChanged(row, result) {
    row.classList.toggle('is-changed', !!result.overridden)
    row.querySelectorAll('textarea').forEach(function (t) {
      t.closest('label').classList.toggle('is-changed', !!result.changed[t.dataset.lang])
    })
  }

  function save(row, values) {
    status(row, 'Saqlanmoqda…')
    return post(window.STX.saveUrl, { key: row.dataset.key, values: values }).then(function (res) {
      if (!res.ok) { status(row, res.data.error || 'Xatolik', 'err'); return }
      row.querySelectorAll('textarea').forEach(function (t) { t.value = res.data.values[t.dataset.lang] })
      markChanged(row, res.data)
      status(row, res.data.overridden ? 'Saqlandi ✓' : 'Asl holiga qaytdi ✓', 'ok')
    }).catch(function () { status(row, 'Tarmoq xatosi', 'err') })
  }

  document.addEventListener('click', function (e) {
    var row = e.target.closest('.stx-row')
    if (!row) return
    if (e.target.classList.contains('stx-save')) save(row, collect(row))
    if (e.target.classList.contains('stx-reset')) {
      if (!confirm('Bu matn asl holiga qaytarilsinmi?')) return
      save(row, { uz: '', ru: '', en: '', kaa: '' })
    }
    if (e.target.classList.contains('stx-translate')) {
      var uz = row.querySelector('textarea[data-lang=uz]').value.trim()
      if (!uz) { status(row, 'Avval o‘zbekcha matnni yozing', 'err'); return }
      status(row, 'Tarjima qilinmoqda…')
      post(window.STX.translateUrl, { fields: { t_uz: uz }, overwrite: true }).then(function (res) {
        var tr = (res.data && res.data.translations) || {}
        if (tr.t_ru) row.querySelector('textarea[data-lang=ru]').value = tr.t_ru
        if (tr.t_en) row.querySelector('textarea[data-lang=en]').value = tr.t_en
        status(row, tr.t_ru || tr.t_en ? 'Tarjima qo‘yildi — tekshirib «Saqlash» ni bosing' : 'Tarjima xizmati javob bermadi', tr.t_ru ? 'ok' : 'err')
      }).catch(function () { status(row, 'Tarmoq xatosi', 'err') })
    }
  })

  // Ctrl/Cmd+Enter inside a textarea saves the row
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.target.matches('.stx-row textarea')) {
      save(e.target.closest('.stx-row'), collect(e.target.closest('.stx-row')))
    }
  })

  // Warn before leaving with unsaved edits
  var dirty = false
  document.addEventListener('input', function (e) { if (e.target.matches('.stx-row textarea')) dirty = true })
  document.addEventListener('click', function (e) { if (e.target.classList.contains('stx-save')) dirty = false })
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = '' } })
})()
