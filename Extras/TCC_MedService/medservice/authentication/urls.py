from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from authentication.views import login
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
#    path('api/login/', login, name='login'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login com JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # renovar token
    
    path ('api-auth/', include('rest_framework.urls')),
     path('', login, name='login'),
]