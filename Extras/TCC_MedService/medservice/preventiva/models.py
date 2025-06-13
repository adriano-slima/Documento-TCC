from django.db import models
from ordens.models import OrdemServico 

class CabPreventiva(models.Model):
    STATUS_CHOICES = [
        ('Aberto', 'Aberto'),
        ('Em andamento', 'Em andamento'),
        ('Concluído', 'Concluído'),
    ]

    ordem_servico = models.ForeignKey(OrdemServico, on_delete=models.CASCADE, related_name='preventivas')
    modelo_checklist = models.ForeignKey('ModeloChecklist', on_delete=models.SET_NULL, null=True, blank=True, related_name='preventivas')
    data_execucao = models.DateField()
    data_emissao = models.DateField()
    data_validade = models.DateField(null=True, blank=True)
    temp_ambiente = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    umidade_relativa = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    executante = models.CharField(max_length=100)
    responsavel = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Aberto')
    consideracoes_finais = models.TextField(blank=True)

    def __str__(self):
        return f"Preventiva OS {self.ordem_servico.id} - {self.status}"


class ModeloChecklist(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class ItemModeloChecklist(models.Model):
    modelo = models.ForeignKey(ModeloChecklist, on_delete=models.CASCADE, related_name='itens')
    nome_item = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.modelo.nome} - {self.nome_item}"


class ItemVerificado(models.Model):
    STATUS_CHOICES = [
        ('Aprovado', 'Aprovado'),
        ('Reprovado', 'Reprovado'),
        ('Não se aplica', 'Não se aplica'),
    ]

    cab_preventiva = models.ForeignKey(CabPreventiva, on_delete=models.CASCADE, related_name='itens_verificados')
    item_modelo = models.ForeignKey(ItemModeloChecklist, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.item_modelo.nome_item} - {self.status}"