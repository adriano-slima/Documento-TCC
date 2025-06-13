from rest_framework import viewsets, generics, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import (
    CabCalibracao, Analisador, Parametro,
    CertificadoAnalisador, ModeloParametro,
    ValorModelo, Medida, ParametroCalibrado
)
from .serializers import (
    CabCalibracaoSerializer, AnalisadorSerializer, ParametroSerializer,
    CertificadoAnalisadorSerializer, ModeloParametroSerializer,
    ValorModeloSerializer, MedidaSerializer, ParametroCalibradoSerializer
)

class CabCalibracaoViewSet(viewsets.ModelViewSet):
    queryset = CabCalibracao.objects.all()
    serializer_class = CabCalibracaoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ordem_servico']

    @action(detail=False, methods=['get'])
    def por_ordem_servico(self, request):
        ordem_servico_id = request.query_params.get('ordem_servico_id')
        if not ordem_servico_id:
            return Response({"error": "ID da ordem de serviço é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        laudo = CabCalibracao.objects.filter(ordem_servico_id=ordem_servico_id).first()
        if laudo:
            serializer = self.get_serializer(laudo)
            return Response(serializer.data)
        return Response({})

class AnalisadorViewSet(viewsets.ModelViewSet):
    queryset = Analisador.objects.all()
    serializer_class = AnalisadorSerializer

    @action(detail=False, methods=['get'])
    def por_parametro(self, request):
        parametro_id = request.query_params.get('parametro_id')
        if not parametro_id:
            return Response({"error": "ID do parâmetro é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        analisadores = Analisador.objects.filter(parametros__id=parametro_id)
        serializer = self.get_serializer(analisadores, many=True)
        return Response(serializer.data)

class AnalisadorSearchView(generics.ListAPIView):
    serializer_class = AnalisadorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['id', 'marca', 'modelo', 'numero_serie', 'patrimonio']

    def get_queryset(self):
        return Analisador.objects.all()

class ParametroViewSet(viewsets.ModelViewSet):
    queryset = Parametro.objects.all()
    serializer_class = ParametroSerializer

class CertificadoAnalisadorViewSet(viewsets.ModelViewSet):
    queryset = CertificadoAnalisador.objects.all()
    serializer_class = CertificadoAnalisadorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['analisador']

class ModeloParametroViewSet(viewsets.ModelViewSet):
    queryset = ModeloParametro.objects.all()
    serializer_class = ModeloParametroSerializer

    @action(detail=False, methods=['get'])
    def por_parametro(self, request):
        parametro_id = request.query_params.get('parametro_id')
        if not parametro_id:
            return Response({"error": "ID do parâmetro é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        modelos = ModeloParametro.objects.filter(parametro_id=parametro_id)
        serializer = self.get_serializer(modelos, many=True)
        return Response(serializer.data)

class ValorModeloViewSet(viewsets.ModelViewSet):
    queryset = ValorModelo.objects.all()
    serializer_class = ValorModeloSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['modelo']

class MedidaViewSet(viewsets.ModelViewSet):
    queryset = Medida.objects.all()
    serializer_class = MedidaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['laudo', 'parametro']

    def perform_create(self, serializer):
        # Calcula a média das leituras
        leitura1 = serializer.validated_data.get('leitura1')
        leitura2 = serializer.validated_data.get('leitura2')
        leitura3 = serializer.validated_data.get('leitura3')
        
        media = (leitura1 + leitura2 + leitura3) / 3
        valor_referencia = serializer.validated_data.get('valor_referencia')
        
        # Calcula o erro
        erro = media - valor_referencia
        
        # Determina a aprovação baseada nas tolerâncias
        parametro = serializer.validated_data.get('parametro')
        tolerancia_superior = parametro.tolerancia_superior
        tolerancia_inferior = parametro.tolerancia_inferior
        
        aprovacao = tolerancia_inferior <= erro <= tolerancia_superior
        
        serializer.save(media=media, erro=erro, aprovacao=aprovacao)

class ParametroCalibradoViewSet(viewsets.ModelViewSet):
    queryset = ParametroCalibrado.objects.all()
    serializer_class = ParametroCalibradoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['laudo']
