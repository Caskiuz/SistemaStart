from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('apps.users.urls')),
    path('sales/', include('apps.sales.urls')),
    path('inventory/', include('apps.inventory.urls')),
    path('distribution/', include('apps.distribution.urls')),
    path('accounting/', include('apps.accounting.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

