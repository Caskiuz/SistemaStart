from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DeliveryBatch, Route, DeliveryAssignment, DeliveryEvent
from apps.sales.models import PreSale, PreSaleItem
from apps.users.models import User
from .serializers import DeliveryBatchSerializer, RouteSerializer
from apps.users.serializers import UserSerializer
from apps.inventory.models import Product, InventoryMovement
from .route_optimizer import optimize_route, haversine_distance

class DistributionViewSet(viewsets.ModelViewSet):
    queryset = DeliveryBatch.objects.select_related('distributor', 'route').prefetch_related('deliveries__presale__client', 'deliveries__presale__items__product').all().order_by('-created_at')
    serializer_class = DeliveryBatchSerializer
    
    @action(detail=False, methods=['post'])
    def manage_routes(self, request):
        """Permite al gerente crear una nueva ruta maestra con descripción"""
        name = request.data.get('name')
        description = request.data.get('description', '')
        
        if not name:
            return Response({"success": False, "message": "El nombre es obligatorio"}, status=400)
            
        route = Route.objects.create(name=name, description=description)
        return Response({
            "success": True, 
            "data": RouteSerializer(route).data
        }, status=201)
    
    @action(detail=False, methods=['get'])
    def my_route(self, request):
        batch = DeliveryBatch.objects.select_related('distributor', 'route').prefetch_related('deliveries__presale__client', 'deliveries__presale__items__product').filter(
            distributor=request.user,
            status='EN_RUTA'
        ).first()

        if not batch:
            return Response(
                {"success": False, "message": "No tienes ruta activa.", "data": None}, 
                status=status.HTTP_200_OK
            )

        serializer = self.get_serializer(batch)
        return Response({"success": True, "data": serializer.data})

    @action(detail=False, methods=['get'])
    def metadata(self, request):
        routes = Route.objects.all()
        distributors = User.objects.filter(role='DISTRIBUCION')
        active_ids = DeliveryBatch.objects.filter(status__in=['PREPARACION', 'EN_RUTA']).values_list('distributor_id', flat=True)
        return Response({
            "routes": RouteSerializer(routes, many=True).data,
            "distributors": UserSerializer(distributors, many=True).data,
            "occupied_distributors": list(active_ids)
        })
        
    @action(detail=False, methods=['get'])
    def all_active_routes(self, request):
        if request.user.role not in ['ADMIN', 'GERENCIA', 'ALMACEN']:
            return Response(
                {"success": False, "message": "No tienes permisos para ver todas las rutas."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        batches = DeliveryBatch.objects.filter(
            status__in=['EN_RUTA', 'PREPARACION']
        ).select_related('distributor', 'route').order_by('-created_at')

        serializer = self.get_serializer(batches, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_history(self, request):
        """Get distributor's completed routes history"""
        batches = DeliveryBatch.objects.filter(
            distributor=request.user
        ).select_related('route').prefetch_related('deliveries').order_by('-created_at')[:10]
        
        serializer = self.get_serializer(batches, many=True)
        return Response({"success": True, "data": serializer.data})

    # Así queda tu función (solo agregando la línea del distribuidor)
    @action(detail=False, methods=['post'])
    def create_route_sheet(self, request):
        route_id = request.data.get('route_id')
        distributor_id = request.data.get('distributor_id')
        presale_ids = request.data.get('presale_ids', [])
        optimize = request.data.get('optimize', True)

        with transaction.atomic():
            batch = DeliveryBatch.objects.create(route_id=route_id, distributor_id=distributor_id, status='EN_RUTA')
            
            # Create assignments
            assignments = []
            for ps_id in presale_ids:
                presale = PreSale.objects.select_related('client').get(id=ps_id)
                assignment = DeliveryAssignment.objects.create(batch=batch, presale=presale)
                assignments.append(assignment)
                
                presale.distributor_id = distributor_id 
                presale.status = 'ASIGNADO'
                presale.save()
            
            # Optimize route if requested
            if optimize:
                optimized = optimize_route(assignments)
                for assignment in optimized:
                    assignment.save()

        return Response({"success": True, "message": "Hoja de ruta creada y optimizada"}, status=201)

    @action(detail=True, methods=['post'])
    def update_delivery_status(self, request, pk=None):
        batch = self.get_object()
        presale_id = request.data.get('presale_id')
        new_status = request.data.get('status') 
        returned_items = request.data.get('returned_items', [])
        
        presale = get_object_or_404(PreSale, id=presale_id)
        
        # GPS proximity validation for CONFIRMADO status
        if new_status == 'CONFIRMADO':
            if batch.current_latitude and batch.current_longitude and presale.client.latitude and presale.client.longitude:
                distance_km = haversine_distance(
                    float(batch.current_latitude), float(batch.current_longitude),
                    float(presale.client.latitude), float(presale.client.longitude)
                )
                
                if distance_km > 0.1:  # More than 100 meters
                    justification = request.data.get('justification', '')
                    if not justification:
                        return Response({
                            "success": False,
                            "requires_justification": True,
                            "distance_km": round(distance_km, 2),
                            "message": f"\u26a0\ufe0f Est\u00e1s a {round(distance_km * 1000)} metros del cliente. Justifica la entrega."
                        }, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            delivery = DeliveryAssignment.objects.get(batch=batch, presale=presale)
            
            if new_status == 'CONFIRMADO': 
                presale.status = 'CONFIRMADO'
                delivery.delivery_status = 'COMPLETADO'
                delivery.completed_at = timezone.now()
                delivery.save()
                
                if returned_items:
                    presale.has_pending_returns = True
                    for ri in returned_items:
                        item = presale.items.get(id=ri['item_id'])
                        item.returned_quantity = ri['quantity']
                        item.save()
            
            elif new_status == 'CANCELADO':
                presale.status = 'CANCELADO' 
                presale.has_pending_returns = True
                delivery.delivery_status = 'COMPLETADO'
                delivery.save()
            
            elif new_status == 'REPROGRAMADO':
                presale.status = 'PENDIENTE'
                presale.scheduled_date = request.data.get('reprogram_date')
                presale.reprogram_reason = request.data.get('reprogram_reason')
                presale.has_pending_returns = True
                DeliveryAssignment.objects.filter(batch=batch, presale=presale).delete()

            presale.save()

        # Auto-finalizar batch si no quedan pendientes
        total_pending = DeliveryAssignment.objects.filter(
            batch=batch
        ).exclude(delivery_status='COMPLETADO').count()
        if total_pending == 0:
            batch.status = 'FINALIZADO'
            batch.save()
        
        return Response({'success': True, 'batch_status': batch.status})
    
    @action(detail=True, methods=['post'])
    def update_delivery_state(self, request, pk=None):
        """Update intermediate delivery state with event tracking"""
        batch = self.get_object()
        delivery_id = request.data.get('delivery_id')
        new_state = request.data.get('state')
        notes = request.data.get('notes', '')
        
        delivery = get_object_or_404(DeliveryAssignment, id=delivery_id, batch=batch)
        
        # Get current GPS location
        latitude = batch.current_latitude
        longitude = batch.current_longitude
        
        with transaction.atomic():
            # Update delivery status
            delivery.delivery_status = new_state
            
            # Update timestamps
            if new_state == 'EN_CAMINO':
                delivery.started_at = timezone.now()
            elif new_state == 'LLEGADO':
                delivery.arrived_at = timezone.now()
            elif new_state == 'COMPLETADO':
                delivery.completed_at = timezone.now()
                delivery.presale.status = 'CONFIRMADO'
                delivery.presale.save()
            
            delivery.save()
            
            # Create event
            DeliveryEvent.objects.create(
                delivery=delivery,
                event_type=new_state,
                latitude=latitude,
                longitude=longitude,
                notes=notes,
                user=request.user
            )
        
        return Response({
            'success': True,
            'delivery_status': delivery.delivery_status,
            'message': f'Estado actualizado a {new_state}'
        })
    
    @action(detail=False, methods=['get'])
    def pending_returns(self, request):
        """Muestra preventas con productos en el camión que deben volver al stock"""
        presales = PreSale.objects.select_related('client', 'seller').prefetch_related('items__product').filter(has_pending_returns=True)
        data = []
        for ps in presales:
            items_to_return = []
            for item in ps.items.all():
                qty = item.quantity if ps.status in ['CANCELADO', 'PENDIENTE'] else item.returned_quantity
                if qty > 0:
                    items_to_return.append({"product_name": item.product.name, "quantity": qty})
            
            if items_to_return:
                data.append({
                    "id": ps.id,
                    "status": ps.status,
                    "client": ps.client.business_name,
                    "items": items_to_return
                })
        return Response({"success": True, "data": data})

    @action(detail=True, methods=['post'])
    def confirm_return(self, request, pk=None):
        """El almacenista confirma que recibió los productos (pk es el ID de PreSale)"""
        presale = get_object_or_404(PreSale, id=pk)
        with transaction.atomic():
            for item in presale.items.all():
                qty = item.quantity if presale.status in ['CANCELADO', 'PENDIENTE'] else item.returned_quantity
                if qty > 0:
                    product = item.product
                    product.stock += qty
                    product.save()
                    InventoryMovement.objects.create(
                        product=product, type='INGRESO', quantity=qty,
                        reason=f"Reingreso - Preventa #{presale.id}", user=request.user
                    )
            presale.has_pending_returns = False
            presale.save()
        return Response({"success": True, "message": "Stock reintegrado."})
    
    @action(detail=False, methods=['post'])
    def update_gps_location(self, request):
        """Endpoint para que el distribuidor envíe su ubicación GPS desde el móvil"""
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if not latitude or not longitude:
            return Response(
                {"success": False, "message": "Latitud y longitud son requeridas"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Buscar el batch activo del distribuidor
        batch = DeliveryBatch.objects.filter(
            distributor=request.user,
            status='EN_RUTA'
        ).first()
        
        if not batch:
            return Response(
                {"success": False, "message": "No tienes una ruta activa"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Actualizar ubicación GPS
        batch.current_latitude = latitude
        batch.current_longitude = longitude
        batch.last_gps_update = timezone.now()
        batch.gps_enabled = True
        batch.save()
        
        return Response({
            "success": True, 
            "message": "Ubicación actualizada",
            "data": {
                "latitude": str(batch.current_latitude),
                "longitude": str(batch.current_longitude),
                "timestamp": batch.last_gps_update.isoformat()
            }
        })
    
    @action(detail=False, methods=['get'])
    def get_all_gps_locations(self, request):
        """Endpoint para que gerencia obtenga todas las ubicaciones GPS de distribuidores activos"""
        if request.user.role not in ['ADMIN', 'GERENCIA']:
            return Response(
                {"success": False, "message": "No tienes permisos"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        batches = DeliveryBatch.objects.filter(
            status='EN_RUTA',
            gps_enabled=True
        ).select_related('distributor', 'route')
        
        locations = []
        for batch in batches:
            if batch.current_latitude and batch.current_longitude:
                locations.append({
                    "batch_id": batch.id,
                    "distributor_id": batch.distributor.id if batch.distributor else None,
                    "distributor_name": batch.distributor.get_full_name() if batch.distributor else "Sin asignar",
                    "route_name": batch.route.name,
                    "latitude": str(batch.current_latitude),
                    "longitude": str(batch.current_longitude),
                    "last_update": batch.last_gps_update.isoformat() if batch.last_gps_update else None,
                    "status": batch.status
                })
        
        return Response({
            "success": True,
            "data": locations,
            "count": len(locations)
        })

    
    @action(detail=True, methods=['get'])
    def delivery_timeline(self, request, pk=None):
        """Get timeline of events for a specific delivery"""
        delivery = get_object_or_404(DeliveryAssignment, id=pk)
        events = delivery.events.all()
        
        timeline = []
        for event in events:
            timeline.append({
                'event_type': event.event_type,
                'timestamp': event.timestamp.isoformat(),
                'latitude': str(event.latitude) if event.latitude else None,
                'longitude': str(event.longitude) if event.longitude else None,
                'notes': event.notes,
                'user': event.user.get_full_name()
            })
        
        duration = None
        if delivery.completed_at and delivery.started_at:
            delta = delivery.completed_at - delivery.started_at
            duration = int(delta.total_seconds() / 60)
        
        return Response({
            'success': True,
            'delivery_id': delivery.id,
            'current_status': delivery.delivery_status,
            'started_at': delivery.started_at.isoformat() if delivery.started_at else None,
            'arrived_at': delivery.arrived_at.isoformat() if delivery.arrived_at else None,
            'completed_at': delivery.completed_at.isoformat() if delivery.completed_at else None,
            'duration_minutes': duration,
            'timeline': timeline
        })
    
    @action(detail=False, methods=['get'])
    def batch_progress(self, request):
        """Get progress statistics for distributor's active batch"""
        batch = DeliveryBatch.objects.filter(
            distributor=request.user,
            status='EN_RUTA'
        ).first()
        
        if not batch:
            return Response({'success': False, 'message': 'No active batch'})
        
        deliveries = batch.deliveries.all()
        total = deliveries.count()
        completed = deliveries.filter(delivery_status='COMPLETADO').count()
        en_camino = deliveries.filter(delivery_status='EN_CAMINO').count()
        llegado = deliveries.filter(delivery_status='LLEGADO').count()
        
        completed_deliveries = deliveries.filter(completed_at__isnull=False, started_at__isnull=False)
        avg_time = None
        if completed_deliveries.exists():
            total_seconds = sum([
                (d.completed_at - d.started_at).total_seconds() 
                for d in completed_deliveries
            ])
            avg_time = int(total_seconds / completed_deliveries.count() / 60)
        
        return Response({
            'success': True,
            'batch_id': batch.id,
            'route_name': batch.route.name,
            'total_deliveries': total,
            'completed': completed,
            'en_camino': en_camino,
            'llegado': llegado,
            'pending': total - completed,
            'progress_percentage': int((completed / total) * 100) if total > 0 else 0,
            'average_delivery_time_minutes': avg_time
        })
