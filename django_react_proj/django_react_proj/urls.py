from django.contrib import admin
from django.urls import path, re_path, include
from users import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("users.urls")),
]
