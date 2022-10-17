from django.db import models


class User(models.Model):
    user_name = models.CharField("Name", max_length=20)
    password = models.CharField("password", max_length=50, default="unsecure")
    email = models.EmailField()
    registrationDate = models.DateField("date", auto_now_add=True)
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.user_name
