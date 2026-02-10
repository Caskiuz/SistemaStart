#!/bin/bash
cd ~/backend
source ~/virtualenv/backend/3.12/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
