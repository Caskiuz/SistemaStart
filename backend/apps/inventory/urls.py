from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, InventoryMovementViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'movements', InventoryMovementViewSet, basename='inventory-movement')

urlpatterns = [
    path('', include(router.urls)),
]