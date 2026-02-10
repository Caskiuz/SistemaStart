import os
import sys

# Configurar PyMySQL como MySQLdb
import pymysql
pymysql.install_as_MySQLdb()

# Ruta al proyecto Django
sys.path.insert(0, os.path.dirname(__file__))

# Configurar Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

# Importar la aplicación WSGI de Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
