from rest_framework.decorators import action
from rest_framework.response import Response
from .models import OrdemServico
from .serializers import OrdemServicoSerializer
from rest_framework import viewsets

class OrdemServicoViewSet(viewsets.ModelViewSet):
    queryset = OrdemServico.objects.all()
    serializer_class = OrdemServicoSerializer

    @action(detail=False, methods=['get'])
    def em_andamento(self, request):
        ordens = OrdemServico.objects.exclude(status='finalizado')
        serializer = self.get_serializer(ordens, many=True)
        return Response(serializer.data)


