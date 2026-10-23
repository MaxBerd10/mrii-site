#!/bin/sh
# Writes the sample resumes (valid + invalid) used by the e2e scripts into ./fx
set -e
cd "$(dirname "$0")/../../backend"
.venv/bin/python manage.py shell -c "
import json, os
from cms.tests import VALID_RESUMES, INVALID_RESUMES
out = os.path.abspath('../tests/applicant-flow/fx'); os.makedirs(out, exist_ok=True); idx = {}
for group, items in (('valid', VALID_RESUMES), ('invalid', INVALID_RESUMES)):
    for label, (name, data) in items.items():
        open(os.path.join(out, label + '.bin'), 'wb').write(data); idx[label] = {'group': group, 'name': name, 'size': len(data)}
json.dump(idx, open(os.path.join(out, 'index.json'), 'w'), ensure_ascii=False)
print(len(idx), 'fixtures ->', out)
"
