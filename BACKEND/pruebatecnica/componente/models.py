from django.db import models

# Create your models here.
class componente(models.Model):
    id = models.AutoField(primary_key=True)
    descripcion = models.TextField(blank=True, null=True)
    unidad = models.CharField(max_length=100, blank=True, null=True)
    valor_maximo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor_minimo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __int__(self):
        return self.id

    class Meta:
        verbose_name = 'Componente'
        verbose_name_plural = 'Componentes'
        ordering = ['id']  # Ordenar por id de forma ascendente

class Medicion(models.Model):
    componente = models.ForeignKey(componente, on_delete=models.CASCADE, related_name='mediciones')
    valor = models.FloatField()
    fecha = models.DateField()