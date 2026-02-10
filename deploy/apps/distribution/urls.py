from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DistributionViewSet

router = DefaultRouter()
router.register(r'batches', DistributionViewSet, basename='delivery-batch')

urlpatterns = [
    path('', include(router.urls)),
]