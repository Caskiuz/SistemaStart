from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, PreSaleViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='cliente')
router.register(r'presales', PreSaleViewSet, basename='presale')

urlpatterns = [
    path('', include(router.urls))
]
