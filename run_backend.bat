@echo off
echo Iniciando Backend Django...
cd backend
call venv\Scripts\activate.bat
python manage.py runserver