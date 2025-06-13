from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CabCalibracaoViewSet, MedidaViewSet, ParametroCalibradoViewSet,
    ValorModeloViewSet, AnalisadorViewSet, ParametroViewSet,
    ModeloParametroViewSet, CertificadoAnalisadorViewSet
)

router = DefaultRouter()
router.register(r'cab-calibracoes', CabCalibracaoViewSet)
router.register(r'medidas', MedidaViewSet)
router.register(r'parametros-calibrados', ParametroCalibradoViewSet)
router.register(r'valores-modelo', ValorModeloViewSet)
router.register(r'analisadores', AnalisadorViewSet)
router.register(r'parametros', ParametroViewSet)
router.register(r'modelos-parametro', ModeloParametroViewSet)
router.register(r'certificados', CertificadoAnalisadorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
