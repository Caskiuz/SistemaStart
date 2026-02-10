from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/sales/', include('apps.sales.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/distribution/', include('apps.distribution.urls')),
    path('api/accounting/', include('apps.accounting.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

