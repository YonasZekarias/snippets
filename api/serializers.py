from core.models import Snippet
from  rest_framework import serializers
from django.contrib.auth import get_user_model
User=get_user_model()

class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = '__all__'
        read_only_fields = ['updated_at', 'created_at','author']
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name','phone_number','profile_img_url','password']
        read_only_fields = ['id',]
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
