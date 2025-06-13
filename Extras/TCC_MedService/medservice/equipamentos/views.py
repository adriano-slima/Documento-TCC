from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Equipamento
from .serializers import EquipamentoSerializer

class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer

    # Endpoint para buscar equipamentos por cliente
    @action(detail=False, methods=['get'])
    def por_cliente(self, request):
        cliente_id = request.query_params.get('cliente_id', None)
        if cliente_id:
            equipamentos = Equipamento.objects.filter(proprietario_id=cliente_id)
            serializer = self.get_serializer(equipamentos, many=True)
            return Response(serializer.data)
        return Response({"erro": "É necessário fornecer um cliente_id"}, status=400)

    @action(detail=True, methods=["patch"])
    def inativar(self, request, pk=None):
        equipamento = self.get_object()
        equipamento.status = "Inativo"
        equipamento.save()
        return Response({"status": "Equipamento inativado"})