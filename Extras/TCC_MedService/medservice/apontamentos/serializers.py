from rest_framework import serializers
from .models import Apontamento

class ApontamentoSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Apontamento
        fields = ['id', 'ordem_servico', 'usuario', 'usuario_nome', 'descricao', 'status_no_momento', 'data']
        read_only_fields = ['usuario', 'data']