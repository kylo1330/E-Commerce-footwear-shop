# Generated by Django 5.0.2 on 2024-06-10 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0010_remove_cart_price_cart_sumtotal_alter_cart_count_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='size',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='footwear',
            name='size',
            field=models.CharField(max_length=100),
        ),
    ]
