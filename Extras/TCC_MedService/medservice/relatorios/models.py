from django.db import models
from django.utils import timezone
from ordens.models import OrdemServico
from clientes.models import Cliente
from equipamentos.models import Equipamento
from preventiva.models import CabPreventiva, ItemVerificado

class LaudoPreventiva(models.Model):
    ordem_servico = models.ForeignKey(OrdemServico, on_delete=models.CASCADE)
    cab_preventiva = models.ForeignKey(CabPreventiva, on_delete=models.CASCADE)
    data_emissao = models.DateField()
    data_validade = models.DateField()
    executante = models.CharField(max_length=100)
    responsavel = models.CharField(max_length=100)
    consideracoes_finais = models.TextField(blank=True)
    data_criacao = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Laudo Preventiva - OS {self.ordem_servico.id}"

    @property
    def cliente(self):
        return self.ordem_servico.cliente

    @property
    def equipamento(self):
        return self.ordem_servico.equipamento

    @property
    def itens_verificados(self):
        return ItemVerificado.objects.filter(cab_preventiva=self.cab_preventiva)

    @property
    def condicoes_ambientais(self):
        return {
            'temperatura': self.cab_preventiva.temp_ambiente,
            'umidade_relativa': self.cab_preventiva.umidade_relativa
        }

class LaudoCalibracao(models.Model):
    equipamento = models.CharField(max_length=100)
    numero_serie = models.CharField(max_length=50)
    data_calibracao = models.DateField()
    tecnico_responsavel = models.CharField(max_length=100)
    certificado = models.CharField(max_length=50)
    observacoes = models.TextField(blank=True)
    data_criacao = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Laudo Calibração - {self.equipamento} - {self.data_calibracao}"
