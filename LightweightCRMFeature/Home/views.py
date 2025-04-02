from django.shortcuts import render
from django.http import JsonResponse
from django.middleware.csrf import get_token
# Create your views here.
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})
