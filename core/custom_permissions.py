from rest_framework.permissions import BasePermission

class IsAdminOrUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return request.user.is_staff or obj == request.user
        else:
            return False