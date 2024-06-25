from django.urls import path
from . import views
from .views import  ToggleFootwearStatusView, footwear_detail_user, list_cart

urlpatterns = [
    path('signup', views.signup, name='signup_api'),
    path('login', views.login, name='login_api'),
    path('logout', views.logout, name='logout_api'),
    path('create_foot', views.CreateFootwearView.as_view(), name='create_footwear'),
    path('list_event', views.list_event, name='listeventapi'),
    path('event/<int:pk>', views.footwear_detail, name='foot_detail_api'),
    path('update_event/<int:pk>', views.update_event, name='updateeventapi'),
    path('delete_event/<int:id>/', views.delete_event, name='delete_event'),
    path('toggle_footwear_status/<int:pk>/',ToggleFootwearStatusView.as_view(), name='toggle_footwear_status_api'),





    path('footwear/user/<int:footwear_id>/', footwear_detail_user, name='footwear_detail_user'),
    path('add_cart_item/', views.add_cart_item, name='add_cart_item'),
    path('list_cart/', list_cart, name='list_cart'),
    path('delete_cart/<int:pk>/', views.delete_cart, name='delete_cart'),

    path('create_order/', views.create_order, name='create_order'),







]

