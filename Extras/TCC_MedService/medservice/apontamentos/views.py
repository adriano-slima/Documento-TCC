# apontamentos/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Apontamento
from .serializers import ApontamentoSerializer
import logging

logger = logging.getLogger(__name__)

class ApontamentoViewSet(viewsets.ModelViewSet):
    serializer_class = ApontamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ordem_servico']

    def get_queryset(self):
        queryset = Apontamento.objects.all()
        ordem_servico = self.request.query_params.get('ordem_servico', None)
        
        # Log para debug
        logger.info(f"Filtrando apontamentos. ordem_servico: {ordem_servico}")
        logger.info(f"Query params: {self.request.query_params}")
        
        if ordem_servico is not None:
            try:
                ordem_servico = int(ordem_servico)  # Garante que é um número
                queryset = queryset.filter(ordem_servico=ordem_servico)
                logger.info(f"Apontamentos filtrados: {queryset.count()}")
            except ValueError:
                logger.error(f"Valor inválido para ordem_servico: {ordem_servico}")
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
