"""
URL configuration for medservice project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect 
from authentication.views import login
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
#    path('', lambda request: redirect('/api/login/')), 
#    path('api/login/', login, name='login'),

#    path('', lambda request: redirect('/api/token/')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login com JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # renovar token

    path('api-auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('clientes.urls')),
    path('api/', include('equipamentos.urls')),
    path('api/', include('ordens.urls')),
    path('api/', include('apontamentos.urls')),
    path('api/calibracao/', include('calibracao.urls')),
    path('api/preventiva/', include('preventiva.urls')),
    path('api/relatorios/', include('relatorios.urls')),
]