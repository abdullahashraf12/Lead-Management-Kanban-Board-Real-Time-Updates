# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] 

    # Specify related_name for groups and user_permissions to avoid clash
    groups = models.ManyToManyField(
        'auth.Group', related_name='custom_user_set', blank=True,
        verbose_name='groups', help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', related_name='custom_user_permissions_set', blank=True,
        verbose_name='user permissions', help_text='Specific permissions for this user.'
    )

    def __str__(self):
        return self.email  # Return email as the string representation of the user
