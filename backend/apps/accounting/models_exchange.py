from django.db import models

class ExchangeRate(models.Model):
    rate = models.DecimalField(max_digits=10, decimal_places=2, help_text="Tasa Bs por 1 USD")
    date = models.DateField(auto_now_add=True)
    set_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-date']
        
    def __str__(self):
        return f"{self.rate} Bs/USD - {self.date}"
    
    @classmethod
    def get_current_rate(cls):
        active = cls.objects.filter(is_active=True).first()
        return active.rate if active else 6.96
