from rest_framework import serializers
from .models import CabPreventiva, ModeloChecklist, ItemModeloChecklist, ItemVerificado

class CabPreventivaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CabPreventiva
        fields = '__all__'


class ModeloChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModeloChecklist
        fields = '__all__'


class ItemModeloChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemModeloChecklist
        fields = '__all__'


class ItemVerificadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVerificado
        fields = '__all__'
