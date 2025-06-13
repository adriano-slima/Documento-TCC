from django.db import models
from clientes.models import Cliente
from equipamentos.models import Equipamento

class OrdemServico(models.Model):
    TIPO_CHOICES = [
        ('corretiva interna', 'Corretiva Interna'),
        ('corretiva externa', 'Corretiva Externa'),
        ('preventiva interna', 'Preventiva Interna'),
        ('preventiva externa', 'Preventiva Externa'),
    ]

    STATUS_CHOICES = [
        ('aberta', 'Aberta'),
        ('aguardando envio do laudo', 'Aguardando Envio do Laudo'),
        ('executado - aguardando faturamento', 'Executado - Aguardando Faturamento'),
        ('aguardando envio do orçamento', 'Aguardando Envio do Orçamento'),
        ('aguardando aprovação', 'Aguardando Aprovação'),
        ('aguardando peça para continuar orçamento', 'Aguardando Peça para Continuar Orçamento'),
        ('aprovado - aguardando execução', 'Aprovado - Aguardando Execução'),
        ('reprovado', 'Reprovado'),
        ('finalizado', 'Finalizado'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    motivo = models.TextField()
    data_abertura = models.DateField(auto_now_add=True)
    data_fechamento = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='aberta')
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    equipamento = models.ForeignKey(Equipamento, on_delete=models.CASCADE)

    def __str__(self):
        return f"OS {self.id} - {self.cliente.nome_fantasia} - {self.status}"
