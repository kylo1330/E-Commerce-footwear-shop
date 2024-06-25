from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Cart, shoe_auth, Footwear, Order

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ShoeAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = shoe_auth
        fields = ['id', 'email', 'password']

class FootwearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Footwear
        fields = ['id', 'brand', 'category', 'model', 'size', 'price', 'stock', 'image', 'enabled']


from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'category', 'footwear', 'user', 'brand', 'size', 'model','quantity', 'sumTotal', 'image']












class OrderSerializer(serializers.ModelSerializer):
    footwear = FootwearSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'footwear', 'total_price', 'status', 'order_date', 'delivery_address']