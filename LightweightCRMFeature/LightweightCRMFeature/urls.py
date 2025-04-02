"""
URL configuration for LightweightCRMFeature project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from UserAuthentication.views import login_post,register_post,check_User_Login,logout_user

from django.urls import re_path
from Home.consumers import KanbanConsumer
from Home.views import get_csrf_token

urlpatterns = [
    path("api/checkUserLogin/", check_User_Login),

    path("api/get-csrf-token/", get_csrf_token),
    path("api/register_post/",register_post),
    path("api/login_post/",login_post),
    path("api/Logout/",logout_user),
    path("admin/", admin.site.urls),
]

websocket_route = [
    re_path(r'ws/kanban/$', KanbanConsumer.as_asgi()),
]