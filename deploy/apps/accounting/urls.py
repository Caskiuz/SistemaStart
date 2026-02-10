from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountingViewSet, AccountReceivableViewSet
from .views_petty_cash import PettyCashViewSet, PettyCashTransactionViewSet

router = DefaultRouter()
router.register(r'', AccountingViewSet, basename='accounting')
router.register(r'accounts-receivable', AccountReceivableViewSet, basename='accounts-receivable')
router.register(r'petty-cash', PettyCashViewSet, basename='petty-cash')
router.register(r'petty-cash-transactions', PettyCashTransactionViewSet, basename='petty-cash-transactions')

urlpatterns = [
    path('', include(router.urls)),
]