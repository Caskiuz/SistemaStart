from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import SalesGPSLocation, User

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_sales_gps(request):
    """Vendedor actualiza su ubicación GPS"""
    if request.user.role != 'VENTAS':
        return Response(
            {"success": False, "message": "Solo vendedores pueden enviar ubicación"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')
    
    if not latitude or not longitude:
        return Response(
            {"success": False, "message": "Latitud y longitud son requeridas"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Actualizar o crear ubicación
    gps_location, created = SalesGPSLocation.objects.update_or_create(
        seller=request.user,
        defaults={
            'latitude': latitude,
            'longitude': longitude,
            'is_active': True
        }
    )
    
    return Response({
        "success": True,
        "message": "Ubicación actualizada",
        "data": {
            "latitude": str(gps_location.latitude),
            "longitude": str(gps_location.longitude),
            "timestamp": gps_location.timestamp.isoformat()
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_sales_gps(request):
    """Gerencia obtiene ubicaciones de todos los vendedores"""
    if request.user.role != 'GERENCIA':
        return Response(
            {"success": False, "message": "Solo gerencia puede ver ubicaciones"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener vendedores activos con GPS
    locations = SalesGPSLocation.objects.filter(
        is_active=True,
        seller__is_active=True
    ).select_related('seller')
    
    data = []
    for loc in locations:
        data.append({
            "seller_id": loc.seller.id,
            "seller_name": loc.seller.get_full_name() or loc.seller.username,
            "seller_email": loc.seller.email,
            "latitude": str(loc.latitude),
            "longitude": str(loc.longitude),
            "last_update": loc.timestamp.isoformat(),
            "is_active": loc.is_active
        })
    
    return Response({
        "success": True,
        "data": data,
        "count": len(data)
    })
