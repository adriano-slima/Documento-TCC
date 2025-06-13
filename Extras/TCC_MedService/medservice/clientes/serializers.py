from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = [
            'id', 'nome_fantasia', 'razao_social', 'tipo_cliente', 'cnpj_cpf',
            'cep', 'uf', 'cidade', 'endereco', 'numero', 'complemento',
            'telefone', 'telefone2', 'email', 'nome_contato', 'cargo', 'setor', 'status'
        ]
