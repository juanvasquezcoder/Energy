from django.db import models

class XSubirData(models.Model):
    # En SQLite 'TEXT' se mapea a CharField. Es la clave primaria.
    Cedula = models.CharField(primary_key=True, max_length=20)
    nombre = models.CharField(max_length=100)
    Estado = models.CharField(max_length=50)
    fecha_registro = models.DateField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False  # MUY IMPORTANTE: Django no intentará crear ni modificar esta tabla.
        db_table = 'X_SUBIR_DATA' # El nombre exacto de la tabla en la BD.
        verbose_name = 'Dato de Cartera'
        verbose_name_plural = 'Datos de Cartera'

    def __str__(self):
        return f"{self.Cedula} - {self.nombre}"