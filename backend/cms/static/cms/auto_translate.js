/**
 * MRII Admin — fill RU/EN fields from UZ inputs (visible in the form).
 */
(function () {
  function csrfToken() {
    const el = document.querySelector('[name=csrfmiddlewaretoken]');
    if (el) return el.value;
    const m = document.cookie.match(/csrftoken=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function openLangSections() {
    document.querySelectorAll('fieldset.collapse details').forEach(function (d) {
      d.open = true;
    });
    document.querySelectorAll('fieldset.collapse').forEach(function (fs) {
      fs.classList.remove('collapsed');
    });
  }

  function fieldEl(name) {
    return (
      document.getElementById('id_' + name) ||
      document.querySelector('#content-main form [name="' + name + '"]')
    );
  }

  function collectUz() {
    const fields = {};
    document.querySelectorAll('#content-main form input[name$="_uz"], #content-main form textarea[name$="_uz"]').forEach(function (el) {
      const v = (el.value || '').trim();
      if (v) fields[el.name] = v;
    });
    return fields;
  }

  function applyTranslations(map) {
    let n = 0;
    Object.keys(map).forEach(function (name) {
      const el = fieldEl(name);
      if (!el) return;
      el.value = map[name];
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.classList.add('mrii-translated-flash');
      n += 1;
    });
    return n;
  }

  function setStatus(btn, text, ok) {
    let status = document.getElementById('mrii-translate-status');
    if (!status) {
      status = document.createElement('span');
      status.id = 'mrii-translate-status';
      status.className = 'mrii-translate-bar__status';
      btn.parentNode.appendChild(status);
    }
    status.textContent = text;
    status.style.color = ok ? '#0f766e' : '#b91c1c';
  }

  async function runTranslate(btn) {
    const fields = collectUz();
    if (!Object.keys(fields).length) {
      setStatus(btn, 'Avval «O‘zbekcha» bo‘limidagi maydonlarni to‘ldiring.', false);
      return;
    }

    btn.disabled = true;
    setStatus(btn, 'Tarjima qilinmoqda…', true);

    try {
      const res = await fetch('/admin/cms/translate/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken(),
          Accept: 'application/json',
        },
        body: JSON.stringify({ fields: fields, overwrite: true }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        setStatus(btn, 'Server JSON qaytarmadi (login yoki xato sahifa).', false);
        return;
      }

      if (!res.ok) {
        setStatus(btn, data.error || ('Xato: ' + res.status), false);
        return;
      }

      const translations = data.translations || {};
      const apiCount = Object.keys(translations).length;
      if (!apiCount) {
        const detail = (data.errors && data.errors.length)
          ? data.errors[0]
          : 'Tarjima xizmati javob bermadi';
        setStatus(btn, 'Tarjima bo‘lmadi: ' + detail, false);
        return;
      }

      openLangSections();
      const applied = applyTranslations(translations);
      if (applied) {
        setStatus(
          btn,
          applied + ' ta maydon to‘ldirildi (Русский / English ochildi). Endi Saqlashni bosing.',
          true
        );
        const firstKey = Object.keys(translations)[0];
        const first = fieldEl(firstKey);
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setStatus(
          btn,
          'Tarjima keldi, lekin formada RU/EN maydon topilmadi. Sahifani yangilab qayta urinib ko‘ring.',
          false
        );
      }
    } catch (err) {
      setStatus(btn, 'So‘rov xatosi: ' + (err && err.message ? err.message : 'network'), false);
    } finally {
      btn.disabled = false;
    }
  }

  function mount() {
    const form = document.querySelector('#content-main form');
    if (!form || document.getElementById('mrii-translate-bar')) return;
    if (!document.querySelector('#content-main form input[name$="_uz"], #content-main form textarea[name$="_uz"]')) {
      return;
    }

    const bar = document.createElement('div');
    bar.id = 'mrii-translate-bar';
    bar.className = 'mrii-translate-bar';
    bar.innerHTML =
      '<div class="mrii-translate-bar__copy">' +
      '<strong>Avtomatik tarjima</strong>' +
      '<span>1) O‘zbekcha yozing  2) Tugmani bosing  3) Rus/English ochilib to‘ldiriladi  4) Saqlash</span>' +
      '</div>' +
      '<div class="mrii-translate-bar__actions">' +
      '<button type="button" class="mrii-translate-btn" id="mrii-translate-btn">Rus va inglizchani to‘ldirish</button>' +
      '</div>';

    const content = document.getElementById('content-main');
    content.insertBefore(bar, content.firstChild);

    document.getElementById('mrii-translate-btn').addEventListener('click', function () {
      runTranslate(this);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
