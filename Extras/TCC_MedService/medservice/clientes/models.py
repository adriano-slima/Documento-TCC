from django.db import models

class Cliente(models.Model):
    TIPO_CLIENTE_CHOICES = [
        ('Pessoa Física', 'Pessoa Física'),
        ('Pessoa Jurídica', 'Pessoa Jurídica'),
    ]
    
    STATUS_CHOICES = [
        ('Ativo', 'Ativo'),
        ('Inativo', 'Inativo'),
    ]

    UF_CHOICES = [
        ('AC', 'Acre'), ('AL', 'Alagoas'), ('AP', 'Amapá'), ('AM', 'Amazonas'),
        ('BA', 'Bahia'), ('CE', 'Ceará'), ('DF', 'Distrito Federal'), ('ES', 'Espírito Santo'),
        ('GO', 'Goiás'), ('MA', 'Maranhão'), ('MT', 'Mato Grosso'), ('MS', 'Mato Grosso do Sul'),
        ('MG', 'Minas Gerais'), ('PA', 'Pará'), ('PB', 'Paraíba'), ('PR', 'Paraná'),
        ('PE', 'Pernambuco'), ('PI', 'Piauí'), ('RJ', 'Rio de Janeiro'), ('RN', 'Rio Grande do Norte'),
        ('RS', 'Rio Grande do Sul'), ('RO', 'Rondônia'), ('RR', 'Roraima'), ('SC', 'Santa Catarina'),
        ('SP', 'São Paulo'), ('SE', 'Sergipe'), ('TO', 'Tocantins')
    ]

    nome_fantasia = models.CharField(max_length=100)
    razao_social = models.CharField(max_length=100)
    tipo_cliente = models.CharField(max_length=20, choices=TIPO_CLIENTE_CHOICES)
    cnpj_cpf = models.CharField(max_length=20)
    cep = models.CharField(max_length=9)  # Formato: 00000-000
    uf = models.CharField(max_length=2, choices=UF_CHOICES)  # ENUM com todos os estados
    cidade = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)
    numero = models.CharField(max_length=10)
    complemento = models.CharField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=20)
    telefone2 = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(max_length=100)
    nome_contato = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100)
    setor = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.nome_fantasia} - {self.cnpj_cpf}"
