# Applicant & HR Mini App end-to-end checks

Exercise the whole job-application path in a real browser against a LOCAL stack, with a fake
Telegram Bot API (nothing is sent to real Telegram):

* 20 resume kinds (PDF, Word, RTF, ODT, TXT, JPG/PNG/WebP, iPhone HEIC, odd file names, exactly 10 MB…)
  must be accepted; 12 bad kinds (.exe, HTML renamed .pdf, SVG, ZIP, empty, >10 MB…) must be rejected
  with a clear message; no-file and text-only applications must work.
* Every accepted resume must reach the HR chat with the exact bytes and the right extension.
* HR Mini App: auth edge cases, XSS inertness, error states, 429/413/500/offline messages in uz/ru/en/kaa.

## Run

```bash
# 1. backend against the fake Telegram (token/base are test values)
cd backend && .venv/bin/python manage.py migrate && .venv/bin/python manage.py add_hr_telegram 777 --name "Test HR"
TELEGRAM_BOT_TOKEN=123456:LOCAL-TEST-TOKEN TELEGRAM_API_BASE=http://127.0.0.1:8099 \
  THROTTLE_INQUIRY_CREATE=1000/hour CORS_ALLOWED_ORIGINS=http://localhost:8443 \
  .venv/bin/python manage.py runserver 8001 &
# 2. frontend (VITE_API_URL=http://127.0.0.1:8001 in .env) and fake Telegram
npm run dev &            # http://localhost:8443
node tests/applicant-flow/fake_telegram.mjs &
# 3. fixtures + checks
sh tests/applicant-flow/make_fixtures.sh
node tests/applicant-flow/applicant_e2e.mjs     # public form, 34 scenarios
node tests/applicant-flow/miniapp_e2e.mjs       # HR side, 34 checks
node tests/applicant-flow/errors_e2e.mjs        # error mapping x 4 languages, 28 checks
```

The bot token above is a dummy used only to sign test `initData`.
