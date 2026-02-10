from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import User

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'password']
        
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        
        user = User.objects.create_user(**validated_data)
        return user
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.EmailField()

    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'role': self.user.role,
        }
        data['role'] = self.user.role
        
        return data