from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CabPreventivaViewSet,
    ModeloChecklistViewSet,
    ItemModeloChecklistViewSet,
    ItemVerificadoViewSet
)

router = DefaultRouter()
router.register(r'cab-preventivas', CabPreventivaViewSet)
router.register(r'modelos-checklist', ModeloChecklistViewSet)
router.register(r'itens-modelo-checklist', ItemModeloChecklistViewSet)
router.register(r'itens-verificados', ItemVerificadoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]