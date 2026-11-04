(function () {
  'use strict'
  var body = document.body
  var btn = document.getElementById('m-menu-btn')
  function setMenu(open) {
    body.classList.toggle('m-menu-open', open)
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false')
  }
  if (btn) btn.addEventListener('click', function () { setMenu(!body.classList.contains('m-menu-open')) })
  document.addEventListener('click', function (e) { if (e.target.closest('[data-m-close]')) setMenu(false) })
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false) })

  var sb = document.getElementById('searchbar')
  if (sb && !sb.placeholder) sb.placeholder = 'Shu ro‘yxatdan qidirish…'

  // ── global search ──
  var script = document.currentScript || document.querySelector('script[data-search-url]')
  var url = script && script.getAttribute('data-search-url')
  var boxes = document.querySelectorAll('.m-search')
  var timer = null
  var seq = 0

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] })
  }

  boxes.forEach(function (box) {
    var input = box.querySelector('input')
    var pop = box.querySelector('.m-search__pop')
    var hits = []
    var active = -1

    function close() { pop.hidden = true; active = -1 }
    function mark() {
      hits.forEach(function (h, i) { h.setAttribute('aria-selected', i === active ? 'true' : 'false') })
      if (hits[active]) hits[active].scrollIntoView({ block: 'nearest' })
    }
    function render(groups, q) {
      if (!groups.length) {
        pop.innerHTML = '<div class="m-search__empty">«' + esc(q) + '» bo‘yicha hech narsa topilmadi. Boshqa so‘z bilan urinib ko‘ring.</div>'
      } else {
        pop.innerHTML = groups.map(function (g) {
          return '<div class="m-search__group">' + esc(g.title) + '</div>' + g.items.map(function (it) {
            return '<a class="m-search__hit" role="option" href="' + esc(it.url) + '"><strong>' + esc(it.title) + '</strong>' + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</a>'
          }).join('')
        }).join('')
      }
      hits = Array.prototype.slice.call(pop.querySelectorAll('.m-search__hit'))
      active = -1
      pop.hidden = false
    }
    function run() {
      var q = input.value.trim()
      if (q.length < 2) { close(); return }
      var mine = ++seq
      fetch(url + '?q=' + encodeURIComponent(q), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json() })
        .then(function (d) { if (mine === seq) render(d.groups || [], q) })
        .catch(function () { pop.innerHTML = '<div class="m-search__empty">Qidirib bo‘lmadi. Internetni tekshiring.</div>'; pop.hidden = false })
    }
    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 180) })
    input.addEventListener('focus', function () { if (hits.length) pop.hidden = false })
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (hits.length) { active = (active + 1) % hits.length; mark() } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (hits.length) { active = (active - 1 + hits.length) % hits.length; mark() } }
      else if (e.key === 'Enter') { var h = hits[active] || hits[0]; if (h) { e.preventDefault(); window.location = h.href } }
      else if (e.key === 'Escape') { close(); input.blur() }
    })
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) close() })
  })

  // "/" focuses the first visible search box
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
    var t = e.target
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
    for (var i = 0; i < boxes.length; i++) {
      var inp = boxes[i].querySelector('input')
      if (inp && inp.offsetParent !== null) { e.preventDefault(); inp.focus(); return }
    }
  })
})()
