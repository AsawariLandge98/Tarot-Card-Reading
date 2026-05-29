from django.contrib import admin
from django.urls import path, include
from users import auth_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Readings APIs
    path('api/', include('readings.urls')),

    # Auth APIs
    path('api/auth/login/',                auth_views.admin_login),
    path('api/auth/forgot-password/',      auth_views.forgot_password),
    path('api/auth/reset-password/',       auth_views.reset_password),

    # Superuser — Admin Management
    path('api/auth/admins/',               auth_views.list_admins),
    path('api/auth/admins/create/',        auth_views.create_admin),
    path('api/auth/admins/<int:pk>/delete/', auth_views.delete_admin),
    path('api/auth/admins/change-password/', auth_views.change_admin_password),
]