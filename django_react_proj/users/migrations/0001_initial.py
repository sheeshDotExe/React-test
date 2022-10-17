# Generated by Django 4.0.4 on 2022-09-20 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_name', models.CharField(max_length=20, verbose_name='Name')),
                ('password', models.CharField(default='unsecure', max_length=50, verbose_name='password')),
                ('email', models.EmailField(max_length=254)),
                ('registrationDate', models.DateField(auto_now_add=True, verbose_name='date')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
    ]
