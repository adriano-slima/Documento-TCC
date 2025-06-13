from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken

#def get_tokens_for_user(user):
#    refresh = RefreshToken.for_user(user)
#    return {'refresh': str(refresh), 'access': str(refresh.access_token)}

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def login(request):
    if request.method == 'GET':
        return render(request, 'authentication/login.html')
    
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({'token': tokens, 'user': {'username': user.username}})
    else:
        return Response({'error': 'Credenciais inválidas'}, status=400)
 