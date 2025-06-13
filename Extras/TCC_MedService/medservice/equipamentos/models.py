from django.db import models
from clientes.models import Cliente  # Importando o modelo de Cliente

class Equipamento(models.Model):
        
    STATUS_CHOICES = [
        ('Ativo', 'Ativo'),
        ('Inativo', 'Inativo'),
    ]
        
    tipo = models.CharField(max_length=255)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    numero_serie = models.CharField(max_length=100, unique=True)
    patrimonio = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Ativo')
    proprietario = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='equipamentos')

    def __str__(self):
        return f"{self.tipo} - {self.modelo} ({self.proprietario})"
