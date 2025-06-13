from django.urls import path
from . import views

app_name = 'relatorios'

urlpatterns = [
    path('gerar-laudo-preventiva/', views.gerar_laudo_preventiva, name='gerar_laudo_preventiva'),
    path('gerar-laudo-calibracao/', views.gerar_laudo_calibracao, name='gerar_laudo_calibracao'),
    path('laudo-calibracao/<int:laudo_id>/', views.gerar_laudo_calibracao, name='gerar_laudo_calibracao'),
] 