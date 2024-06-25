from django.db import models
from django.core.validators import validate_email
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class shoe_auth(models.Model):
    email = models.CharField(max_length=100, validators=[validate_email])
    password = models.CharField(max_length=50)

class Footwear(models.Model):
    BRAND_CHOICES = (
        ('Nike', 'Nike'),
        ('Adidas', 'Adidas'),
        ('Puma', 'Puma'),
        ('Bata','Bata'),
        # Add more brands as needed
    )
    
    CATEGORY_CHOICES = (
        ('Sports', 'Sports'),
        ('Canvas', 'Canvas'),
        ('Sandals', 'Sandals'),
        ('Slippers', 'Slippers'),
        # Add more categories as needed
    )
    
    brand = models.CharField(max_length=100, choices=BRAND_CHOICES)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    model = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='media', null=True, blank=True)
    enabled = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.brand} {self.model} (Size: {self.size})"
    



from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from .models import Footwear

class Cart(models.Model):
    BRAND_CHOICES = (
        ('Nike', 'Nike'),
        ('Adidas', 'Adidas'),
        ('Puma', 'Puma'),
        ('Bata', 'Bata'),
        # Add more brands as needed
    )
    
    CATEGORY_CHOICES = (
        ('Sports', 'Sports'),
        ('Canvas', 'Canvas'),
        ('Sandals', 'Sandals'),
        ('Slippers', 'Slippers'),
        # Add more categories as needed
    )
    

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    footwear = models.ForeignKey(Footwear, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    model = models.CharField(max_length=100, default='')  # You can adjust the default value as needed
    size = models.CharField(max_length=100) 
    sumTotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  
    image = models.ImageField(upload_to='media', null=True, blank=True)
    brand = models.CharField(max_length=100, choices=BRAND_CHOICES)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    count = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)


    def __str__(self):
        return f"{self.user.username}'s Cart Item: {self.footwear} - {self.quantity}"





class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    razorpay_order_id = models.CharField(max_length=100)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)







class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    footwear = models.ManyToManyField(Footwear)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    order_date = models.DateTimeField(auto_now_add=True)
    delivery_address = models.TextField()

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

    def calculate_total_price(self):
        total = sum(item.price for item in self.footwear.all())
        self.total_price = total
        return total

    def save(self, *args, **kwargs):
        self.calculate_total_price()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-order_date']






