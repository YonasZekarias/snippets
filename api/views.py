from core.models import Snippet
from rest_framework.viewsets import ModelViewSet
from .serializers import SnippetSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth import get_user_model
from core.custom_permissions import IsAdminOrUser

User = get_user_model()

class SnippetViewSet(ModelViewSet):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    def get_permissions(self):
        if self.request.method in ['POST']:
            return [IsAuthenticated()]
        elif self.request.method in ['PUT', 'PATCH', 'DELETE', 'GET']:
            return [IsAdminOrUser()]
        return [permission() for permission in self.permission_classes]
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        elif self.request.method == 'GET':
            return [IsAdminUser()]
        elif self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminOrUser()]
        return [permission() for permission in self.permission_classes]