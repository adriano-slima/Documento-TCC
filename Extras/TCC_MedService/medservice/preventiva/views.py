from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CabPreventiva, ModeloChecklist, ItemModeloChecklist, ItemVerificado
from .serializers import (
    CabPreventivaSerializer,
    ModeloChecklistSerializer,
    ItemModeloChecklistSerializer,
    ItemVerificadoSerializer
)
from rest_framework import status

class CabPreventivaViewSet(viewsets.ModelViewSet):
    queryset = CabPreventiva.objects.all()
    serializer_class = CabPreventivaSerializer

    @action(detail=False, methods=['get'])
    def por_ordem_servico(self, request):
        ordem_servico_id = request.query_params.get('ordem_servico_id')
        if ordem_servico_id:
            preventivas = CabPreventiva.objects.filter(ordem_servico_id=ordem_servico_id)
            serializer = self.get_serializer(preventivas, many=True)
            return Response(serializer.data)
        return Response([])


class ModeloChecklistViewSet(viewsets.ModelViewSet):
    queryset = ModeloChecklist.objects.all()
    serializer_class = ModeloChecklistSerializer


class ItemModeloChecklistViewSet(viewsets.ModelViewSet):
    queryset = ItemModeloChecklist.objects.all()
    serializer_class = ItemModeloChecklistSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['modelo']


class ItemVerificadoViewSet(viewsets.ModelViewSet):
    queryset = ItemVerificado.objects.all()
    serializer_class = ItemVerificadoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['cab_preventiva']

    @action(detail=False, methods=['delete'])
    def por_cab_preventiva(self, request):
        cab_preventiva_id = request.query_params.get('cab_preventiva_id')
        if not cab_preventiva_id:
            return Response({"error": "ID do cabeçalho da preventiva é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ItemVerificado.objects.filter(cab_preventiva_id=cab_preventiva_id).delete()
            return Response({"message": "Itens verificados deletados com sucesso"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

