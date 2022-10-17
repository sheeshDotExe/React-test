from ast import Delete
from django.shortcuts import render
from django.http import Http404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView

from django.contrib.auth.hashers import check_password, make_password

from .models import User
from .serializers import *


def is_user_logged_in(request):
    try:
        if not request.session.exists(request.session.session_key):
            request.session.create()
        if "id" not in request.session:
            request.session["id"] = None
        user = User.objects.get(id=request.session["id"])
        return user
    except User.DoesNotExist:
        return False


class LogoutView(APIView):
    def get(self, request, format=None):
        user = is_user_logged_in(request)
        if user:
            request.session["id"] = None
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class LoginView(APIView):
    def get(self, request, format=None):
        user = is_user_logged_in(request)
        if user:
            serializer = UserSerializer(user, context={"request": request})
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()
        if "id" not in request.session:
            request.session["id"] = None

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            users = User.objects.filter(user_name=serializer.data["user_name"])
            if users.exists():
                for user in users:
                    if check_password(serializer.data["password"], user.password):
                        request.session["id"] = user.id
                        return Response(status=status.HTTP_200_OK)
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    def get(self, request, format=None):
        data = User.objects.all()
        serializer = UserSerializer(data, context={"request": request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            users = User.objects.filter(
                user_name=serializer.validated_data["user_name"]
            )
            if users.exists():
                return Response(status=status.HTTP_409_CONFLICT)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetails(APIView):
    def get_object(self, username):
        try:
            return User.objects.get(user_name=username)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, string, format=None):
        if is_user_logged_in(request):
            user = self.get_object(string)
            if request.session["id"] == user.id:
                serializer = UserSerializer(user)
                return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, string, format=None):
        if is_user_logged_in(request):
            user = self.get_object(string)
            if request.session["id"] == user.id:
                serializer = UserSerializer(
                    user, data=request.data, context={"request": request}
                )
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, string, format=None):
        if is_user_logged_in(request):
            user = self.get_object(string)
            if request.session["id"] == user.id:
                serializer = UserSerializer(user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, string, format=None):
        if is_user_logged_in(request):
            user = self.get_object(string)
            if request.session["id"] == user.id:
                user.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
