# Generated by Django 5.0.2 on 2024-05-31 09:26

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='shoe_auth',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=100, validators=[django.core.validators.EmailValidator()])),
                ('password', models.CharField(max_length=50)),
            ],
        ),
    ]
