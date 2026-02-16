from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrUser(BasePermission):
    """
    Custom permission to only allow users to edit their own profile or admins to edit any profile.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or obj == request.user 

class IsAdminOrSnippetUser(BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True  # Allow all users to read
        return request.user.is_authenticated  # Only authenticated users can modify

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True  # Read operations are always allowed
        return request.user.is_staff or getattr(obj, 'author', None) == request.user  # Ensure correct ownership check
