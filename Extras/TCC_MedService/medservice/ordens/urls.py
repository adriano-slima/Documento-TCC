from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdemServicoViewSet

router = DefaultRouter()
router.register(r'ordens', OrdemServicoViewSet)  # /api/ordens/

urlpatterns = [
    path('', include(router.urls)),
]
