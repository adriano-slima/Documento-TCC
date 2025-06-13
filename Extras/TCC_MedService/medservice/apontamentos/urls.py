from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApontamentoViewSet

router = DefaultRouter()
router.register(r'apontamentos', ApontamentoViewSet, basename='apontamento')

urlpatterns = [
    path('', include(router.urls)),
]