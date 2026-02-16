from core.models import Snippet
from rest_framework.viewsets import ModelViewSet
from .serializers import SnippetSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, SAFE_METHODS
from django.contrib.auth import get_user_model
from core.custom_permissions import IsAdminOrUser, IsAdminOrSnippetUser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
User = get_user_model()

class SnippetViewSet(ModelViewSet):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  
    def get_permissions(self):
        if self.request.method in ['POST', 'GET']:
            return [IsAuthenticated()] 
        elif self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrSnippetUser()]  
        return [permission() for permission in self.permission_classes]
    @action(detail=False, methods=['get'])
    def mySnippets(self, request, pk=None):
        queryset = Snippet.objects.filter(author=request.user)
        serializer = SnippetSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAdminOrUser()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)

        if request.method == 'PUT':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

