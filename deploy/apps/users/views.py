from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from .serializers import UserSerializer, MyTokenObtainPairSerializer

class UserRegisterView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'usuario creado'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer