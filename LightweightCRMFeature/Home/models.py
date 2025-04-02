from django.db import models

# Create your models here.
from django.db import models
import uuid
from django.utils import timezone

class KanBanData(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('lost', 'Lost'),
    ]
    
    id = models.AutoField(primary_key=True)  # Explicit auto-increment
    name = models.CharField(max_length=100, default='John Doe')
    email = models.EmailField(default='john@example.com')
    phone = models.CharField(max_length=20, default='123-456-7890')
    company = models.CharField(max_length=100, default='Acme Inc')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    notes = models.TextField(default='Interested in our premium plan')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.company} ({self.status})"

    class Meta:
        verbose_name = "KanBan Data"
        verbose_name_plural = "KanBan Data"
        ordering = ['-created_at']