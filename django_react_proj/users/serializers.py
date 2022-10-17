from rest_framework import serializers
from .models import User

from django.contrib.auth.hashers import check_password, make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("user_name", "password", "email", "registrationDate")

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data.get("password"))
        return super(UserSerializer, self).create(validated_data)


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("user_name", "password")
