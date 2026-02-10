from django.db import models
from django.conf import settings
from apps.sales.models import PreSale

class Route(models.Model):
    name = models.CharField(max_length=100) 
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
    
class DeliveryBatch(models.Model):
    
    STATUS_CHOICES = [
        ('PREPARACION', 'En Preparación'),
        ('EN_RUTA', 'En Ruta'),
        ('FINALIZADO', 'Finalizado'),
    ]
    
    route = models.ForeignKey(Route, on_delete=models.PROTECT)
    distributor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        limit_choices_to={'role': 'DISTRIBUCION'}
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PREPARACION')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    # GPS Tracking
    current_latitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True, verbose_name="Latitud Actual")
    current_longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True, verbose_name="Longitud Actual")
    last_gps_update = models.DateTimeField(null=True, blank=True, verbose_name="Última Actualización GPS")
    gps_enabled = models.BooleanField(default=False, verbose_name="GPS Activo")

    def __str__(self):
        return f"Despacho {self.id} - {self.route.name}"
    
class DeliveryAssignment(models.Model):
    DELIVERY_STATUS_CHOICES = [
        ('ASIGNADO', 'Asignado'),
        ('EN_CAMINO', 'En Camino'),
        ('LLEGADO', 'Llegado'),
        ('ENTREGANDO', 'Entregando'),
        ('COMPLETADO', 'Completado'),
        ('REPROGRAMADO', 'Reprogramado'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    batch = models.ForeignKey(DeliveryBatch, on_delete=models.CASCADE, related_name='deliveries')
    presale = models.OneToOneField(PreSale, on_delete=models.CASCADE)
    order_in_route = models.PositiveIntegerField(default=1)
    estimated_time = models.TimeField(null=True, blank=True, verbose_name="Hora Estimada")
    actual_arrival_time = models.DateTimeField(null=True, blank=True, verbose_name="Hora Real de Llegada")
    actual_departure_time = models.DateTimeField(null=True, blank=True, verbose_name="Hora Real de Salida")
    
    # Tracking fields
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='ASIGNADO')
    started_at = models.DateTimeField(null=True, blank=True)
    arrived_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

class DeliveryEvent(models.Model):
    EVENT_TYPES = [
        ('ASIGNADO', 'Asignado'),
        ('EN_CAMINO', 'En Camino'),
        ('LLEGADO', 'Llegado'),
        ('ENTREGANDO', 'Entregando'),
        ('COMPLETADO', 'Completado'),
        ('REPROGRAMADO', 'Reprogramado'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    delivery = models.ForeignKey(DeliveryAssignment, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    notes = models.TextField(blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.event_type} - {self.delivery.presale.client.business_name} - {self.timestamp}"
