from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Cliente
from .serializers import ClienteSerializer
from rest_framework import viewsets

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    @action(detail=True, methods=["patch"])
    def inativar(self, request, pk=None):
        cliente = self.get_object()
        cliente.status = "Inativo"
        cliente.save()
        return Response({"status": "Cliente inativado com sucesso"})
