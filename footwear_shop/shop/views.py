from rest_framework import status
from rest_framework.response import Response
from shop.models import Footwear,Cart
from shop.serializers import FootwearSerializer
from .forms import CustomUserCreationForm
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import BasePermission
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from .serializers import  FootwearSerializer,CartSerializer
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication


class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

@api_view(['POST'])
@permission_classes((AllowAny,))
def signup(request):
    form = CustomUserCreationForm(data=request.data)
    if form.is_valid():
        user = form.save()
        return Response("account created successfully", status=status.HTTP_201_CREATED)
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            is_superuser = user.is_superuser
            return Response({'token': token.key,'is_superuser': is_superuser}, status=HTTP_200_OK)
    except User.DoesNotExist:
        pass
    return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'success': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import  Footwear, Order
from .serializers import FootwearSerializer
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly

class CreateFootwearView(APIView):
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

    def post(self, request, *args, **kwargs):
        serializer = FootwearSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        return Footwear.objects.all()  # Or any queryset you want to apply



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_event(request):
    events = Footwear.objects.all()
    serializer = FootwearSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def footwear_detail(request, pk):
    event = get_object_or_404(Footwear, pk=pk)
    serializer = FootwearSerializer(event)
    return Response(serializer.data)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def update_event(request, pk):
    event = get_object_or_404(Footwear, pk=pk)
    serializer = FootwearSerializer(event, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Footwear

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_event(request, id):
    try:
        event = Footwear.objects.get(pk=id)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Footwear.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Footwear
from .serializers import FootwearSerializer

class ToggleFootwearStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            footwear = Footwear.objects.get(pk=pk)
            footwear.enabled = not footwear.enabled
            footwear.save()
            return Response(FootwearSerializer(footwear).data, status=status.HTTP_200_OK)
        except Footwear.DoesNotExist:
            return Response({'error': 'Footwear not found'}, status=status.HTTP_404_NOT_FOUND)
        



#user side



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def footwear_detail_user(request, footwear_id):
    footwear = get_object_or_404(Footwear, pk=footwear_id)
    serializer = FootwearSerializer(footwear)
    data = serializer.data
    order = Order.objects.filter(footwear=footwear).first()
    data['orderId'] = order.id if order else None
    return Response(data)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, Footwear
from .serializers import CartSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_cart_item(request):
    try:
        data = request.data
        footwear_id = data.get('footwear')
        quantity = data.get('quantity')
        image = data.get('image')  # Assuming you pass the image URL in the request data
        
        # Fetch the footwear item
        footwear = Footwear.objects.get(id=footwear_id)
        
        # Fetch the user ID from the request
        user_id = request.user.id
        
        # Calculate the total price
        sum_total = footwear.price * quantity
        
        # Create a new cart item
        cart_item = Cart.objects.create(
            user_id=user_id,
            footwear=footwear,
            quantity=quantity,
            model=footwear.model,  
            size=footwear.size,    
            sumTotal=sum_total, 
            image=image,  
            brand=footwear.brand,  
            category=footwear.category,  
        )
        
        # Serialize the cart item
        serializer = CartSerializer(cart_item)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Footwear.DoesNotExist:
        return Response({"error": "Footwear not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def list_cart(request):
    try:
        user = request.user
        cart_items = Cart.objects.filter(user=user)
        serializer = CartSerializer(cart_items, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_cart(request, pk):
    try:
        cart_item = get_object_or_404(Cart, pk=pk, user=request.user)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Cart.DoesNotExist:
        return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





# Backend code for token authentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Payment
import razorpay
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return Response({"detail": "Invalid JSON in request body."}, status=400)

    amount = data.get('amount')
    if not isinstance(amount, int) or amount < 1:
        return Response({"detail": "Invalid amount. Amount should be an integer and at least 1 INR."}, status=400)

    user = request.user  # User object is retrieved from the request
    client = razorpay.Client(auth=('rzp_test_juCSC8R25SR9Jh', 'LFrrOwX2Bm3meiGA1tvMnTVN'))
    order = client.order.create({
        "amount": amount * 100,  # Convert to paise
        "currency": "INR",
        "payment_capture": 1
    })

    payment = Payment.objects.create(
        user=user,
        razorpay_order_id=order['id'],
        amount=amount  # Store amount in INR
    )

    return Response({
        'order_id': order['id'],
        'amount': amount,
        'payment_id': payment.id
    })
