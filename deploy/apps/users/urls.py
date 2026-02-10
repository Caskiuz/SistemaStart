from django.urls import path
from .views import UserRegisterView, MyTokenObtainPairView
from .gps_views import update_sales_gps, get_all_sales_gps

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pait'),
    path('sales-gps/update/', update_sales_gps, name='update-sales-gps'),
    path('sales-gps/all/', get_all_sales_gps, name='get-all-sales-gps'),
]
