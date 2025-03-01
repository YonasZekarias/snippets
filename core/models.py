from django.db import models
from django.conf import settings  
import uuid

class Snippet(models.Model):
    LANGUAGE_CHOICES = [
        ("PY", "Python"),
        ("JS", "JavaScript"),
        ("C", "C"),
        ("CPP", "C++"),
        ("D", "Dart"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    code = models.TextField(blank=False, null=False)
    language = models.CharField(max_length=4, choices=LANGUAGE_CHOICES, default="PY")

   
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="snippets"
    )

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
