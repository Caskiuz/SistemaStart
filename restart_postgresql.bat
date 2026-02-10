@echo off
echo Reiniciando PostgreSQL...
net stop postgresql-x64-15
net start postgresql-x64-15
echo PostgreSQL reiniciado!
pause