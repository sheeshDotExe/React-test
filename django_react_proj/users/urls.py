from django.contrib import admin
from django.urls import path, re_path, include
from users import views

urlpatterns = [
    re_path(r"^users/$", views.UserView.as_view()),
    re_path(r"^users/(?P<string>[\w\-]+)/$", views.UserDetails.as_view()),
    re_path(r"^login/$", views.LoginView.as_view()),
    re_path(r"^logout/$", views.LogoutView.as_view()),
]
