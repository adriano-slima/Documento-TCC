from django.db import models
from ordens.models import OrdemServico

class CabCalibracao(models.Model):
    ordem_servico = models.ForeignKey(OrdemServico, on_delete=models.CASCADE, related_name='calibracoes')
    data_execucao = models.DateField()
    data_emissao = models.DateField()
    data_validade = models.DateField()
    temp_ambiente = models.DecimalField(max_digits=5, decimal_places=2)
    umidade_relativa = models.DecimalField(max_digits=5, decimal_places=2)
    executante = models.CharField(max_length=255)
    responsavel = models.CharField(max_length=255)
    
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('em_andamento', 'Em andamento'),
        ('concluido', 'Concluído'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aberto')

    def __str__(self):
        return f"Laudo calibração OS {self.ordem_servico.id} - {self.status}"
    
class Parametro(models.Model):
    nome = models.CharField(max_length=100)
    unidade_medida = models.CharField(max_length=50)
    tolerancia_superior = models.DecimalField(max_digits=10, decimal_places=4)
    tolerancia_inferior = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return f"{self.nome} ({self.unidade_medida})"
    
class Analisador(models.Model):
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    numero_serie = models.CharField(max_length=100)
    patrimonio = models.CharField(max_length=100)
    parametros = models.ManyToManyField('Parametro', related_name='analisadores_compatíveis')

    def __str__(self):
        return f"{self.marca} {self.modelo} - Patrimônio: {self.patrimonio}"


class CertificadoAnalisador(models.Model):
    numero_certificado = models.CharField(max_length=100)
    data_calibracao = models.DateField()
    data_validade = models.DateField()
    calibrado_por = models.CharField(max_length=100)
    analisador = models.ForeignKey('Analisador', on_delete=models.CASCADE, related_name='certificados')

    def __str__(self):
        return f"Certificado {self.numero_certificado} - {self.analisador}"
    

class ModeloParametro(models.Model):
    nome_modelo = models.CharField(max_length=100)
    parametro = models.ForeignKey('Parametro', on_delete=models.CASCADE, related_name='modelos')

    def __str__(self):
        return f"{self.nome_modelo} - {self.parametro.nome}"
    
class ValorModelo(models.Model):
    valor = models.DecimalField(max_digits=10, decimal_places=4)
    modelo = models.ForeignKey('ModeloParametro', on_delete=models.CASCADE, related_name='valores')

    def __str__(self):
        return f"{self.valor} ({self.modelo.nome_modelo})"


class Medida(models.Model):
    valor_referencia = models.DecimalField(max_digits=10, decimal_places=4)
    leitura1 = models.DecimalField(max_digits=10, decimal_places=4)
    leitura2 = models.DecimalField(max_digits=10, decimal_places=4)
    leitura3 = models.DecimalField(max_digits=10, decimal_places=4)
    media = models.DecimalField(max_digits=10, decimal_places=4)
    erro = models.DecimalField(max_digits=10, decimal_places=4)
    indice_k = models.DecimalField(max_digits=10, decimal_places=4)
    aprovacao = models.BooleanField()

    parametro = models.ForeignKey('Parametro', on_delete=models.CASCADE, related_name='medidas')
    analisador = models.ForeignKey('Analisador', on_delete=models.CASCADE, related_name='medidas')
    laudo = models.ForeignKey('CabCalibracao', on_delete=models.CASCADE, related_name='medidas')
    certificado = models.ForeignKey('CertificadoAnalisador', on_delete=models.CASCADE, related_name='medidas')

    def __str__(self):
        return f"Medida de {self.parametro.nome} - Laudo #{self.laudo.id}"

class ParametroCalibrado(models.Model):
    laudo = models.ForeignKey(CabCalibracao, on_delete=models.CASCADE, related_name='parametros_calibrados')
    parametro = models.ForeignKey(Parametro, on_delete=models.CASCADE, related_name='laudos_calibrados')

    def __str__(self):
        return f"{self.parametro.nome} no Laudo #{self.laudo.id}"