from rest_framework import serializers
from .models import OrdemServico

class OrdemServicoSerializer(serializers.ModelSerializer):
    cliente_nome = serializers.CharField(source='cliente.nome_fantasia', read_only=True)
    cliente_cnpj_cpf = serializers.CharField(source='cliente.cnpj_cpf', read_only=True)
    equipamento_tipo = serializers.CharField(source='equipamento.tipo', read_only=True)
    equipamento_marca = serializers.CharField(source='equipamento.marca', read_only=True)
    equipamento_modelo = serializers.CharField(source='equipamento.modelo', read_only=True)
    equipamento_numero_serie = serializers.CharField(source='equipamento.numero_serie', read_only=True)

    class Meta:
        model = OrdemServico
        fields = [
            'id', 'tipo', 'motivo', 'data_abertura', 'data_fechamento', 'status',
            'cliente', 'equipamento',
            'cliente_nome', 'cliente_cnpj_cpf',
            'equipamento_tipo', 'equipamento_marca', 'equipamento_modelo', 'equipamento_numero_serie'
        ]