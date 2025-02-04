# Generated by Django 5.0.2 on 2024-06-11 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0012_remove_cart_count_remove_cart_model_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='count',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AddField(
            model_name='cart',
            name='model',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='cart',
            name='sumTotal',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]
