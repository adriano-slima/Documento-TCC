from rest_framework import serializers
from .models import CabCalibracao, Analisador, Parametro, CertificadoAnalisador, ModeloParametro, ValorModelo, Medida, ParametroCalibrado
from django.utils import timezone

class ValorModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValorModelo
        fields = ['id', 'valor', 'modelo']

class ModeloParametroSerializer(serializers.ModelSerializer):
    valores = ValorModeloSerializer(many=True, read_only=True)
    
    class Meta:
        model = ModeloParametro
        fields = ['id', 'nome_modelo', 'parametro', 'valores']

class ParametroSerializer(serializers.ModelSerializer):
    modelos = ModeloParametroSerializer(many=True, read_only=True)
    
    class Meta:
        model = Parametro
        fields = ['id', 'nome', 'unidade_medida', 'tolerancia_superior', 'tolerancia_inferior', 'modelos']

class CertificadoAnalisadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificadoAnalisador
        fields = ['id', 'numero_certificado', 'data_calibracao', 'data_validade', 'calibrado_por', 'analisador']

class AnalisadorSerializer(serializers.ModelSerializer):
    certificados = CertificadoAnalisadorSerializer(many=True, read_only=True)
    parametros = ParametroSerializer(many=True, read_only=True)
    parametros_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Parametro.objects.all(),
        source='parametros',
        write_only=True
    )

    class Meta:
        model = Analisador
        fields = ['id', 'marca', 'modelo', 'numero_serie', 'patrimonio', 'parametros', 'parametros_ids', 'certificados']

    def update(self, instance, validated_data):
        # Remove os parâmetros dos dados validados para atualizá-los separadamente
        parametros = validated_data.pop('parametros', None)
        
        # Atualiza os campos básicos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Atualiza os parâmetros se foram fornecidos
        if parametros is not None:
            instance.parametros.set(parametros)
        
        return instance

class MedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medida
        fields = '__all__'
        
    def validate(self, data):
        # Validação para garantir que o analisador é compatível com o parâmetro
        parametro = data.get('parametro')
        analisador = data.get('analisador')
        
        if parametro and analisador:
            if not analisador.parametros.filter(id=parametro.id).exists():
                raise serializers.ValidationError("O analisador selecionado não é compatível com este parâmetro")
        
        return data

class ParametroCalibradoSerializer(serializers.ModelSerializer):
    parametro_nome = serializers.CharField(source='parametro.nome', read_only=True)
    
    class Meta:
        model = ParametroCalibrado
        fields = ['id', 'laudo', 'parametro', 'parametro_nome']
        
    def validate(self, data):
        # Validação para garantir que não exista duplicidade de parâmetros no mesmo laudo
        laudo = data.get('laudo')
        parametro = data.get('parametro')
        
        if laudo and parametro:
            if ParametroCalibrado.objects.filter(laudo=laudo, parametro=parametro).exists():
                raise serializers.ValidationError("Este parâmetro já foi adicionado ao laudo")
        
        return data

class CabCalibracaoSerializer(serializers.ModelSerializer):
    medidas = MedidaSerializer(many=True, read_only=True)
    parametros_calibrados = ParametroCalibradoSerializer(many=True, read_only=True)
    
    class Meta:
        model = CabCalibracao
        fields = '__all__'
        
    def validate(self, data):
        # Validação para garantir que a data de execução não é futura
        if data.get('data_execucao') and data.get('data_execucao') > timezone.now().date():
            raise serializers.ValidationError("A data de execução não pode ser futura")
            
        # Validação para garantir que a data de validade é posterior à data de emissão
        if data.get('data_emissao') and data.get('data_validade'):
            if data['data_validade'] <= data['data_emissao']:
                raise serializers.ValidationError("A data de validade deve ser posterior à data de emissão")
        
        return data