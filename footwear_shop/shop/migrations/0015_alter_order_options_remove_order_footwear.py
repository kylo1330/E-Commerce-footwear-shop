# Generated by Django 5.0.2 on 2024-06-13 06:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0014_remove_order_status_alter_cart_image_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='order',
            options={},
        ),
        migrations.RemoveField(
            model_name='order',
            name='footwear',
        ),
    ]
