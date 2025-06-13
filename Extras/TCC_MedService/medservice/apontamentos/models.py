from django.db import models
from django.contrib.auth.models import User
from ordens.models import OrdemServico

class Apontamento(models.Model):
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

    ordem_servico = models.ForeignKey(OrdemServico, on_delete=models.CASCADE, related_name='apontamentos')
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    descricao = models.TextField()
    status_no_momento = models.CharField(max_length=50, choices=STATUS_CHOICES)
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Apontamento O.S. #{self.ordem_servico.id} por {self.usuario}"
