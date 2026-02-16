from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import SnippetViewSet
from .views import UserViewSet
router = DefaultRouter()
router.register('snippets', SnippetViewSet)
router.register('users', UserViewSet)
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('',include(router.urls)),
]