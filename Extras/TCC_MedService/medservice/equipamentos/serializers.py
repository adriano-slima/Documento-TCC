from rest_framework import serializers
from .models import Equipamento

class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = ['id', 'tipo', 'marca', 'modelo', 'numero_serie', 'patrimonio', 'status', 'proprietario']
