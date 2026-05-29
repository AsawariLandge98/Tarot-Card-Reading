from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import CustomUser
from .models import Booking, Inquiry, AvailableSlot


# ── Custom User Admin ──
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display  = ('username', 'email', 'is_staff', 'is_superuser', 'is_active')
    list_filter   = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email')
    ordering      = ('-date_joined',)

    # Show email on the ADD user form (first step)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )

    fieldsets = UserAdmin.fieldsets + (
        ('Extra', {'fields': ('is_admin',)}),
    )


# ── Booking Admin ──
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display   = ('client_name', 'email', 'reading_type', 'booking_date', 'booking_time', 'status', 'created_at')
    list_filter    = ('status', 'reading_type')
    search_fields  = ('client_name', 'email', 'phone')
    ordering       = ('-created_at',)
    list_editable  = ('status',)


# ── Inquiry Admin ──
@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display  = ('name', 'email', 'status', 'created_at')
    list_filter   = ('status',)
    search_fields = ('name', 'email', 'message')
    ordering      = ('-created_at',)


# ── Available Slot Admin ──
@admin.register(AvailableSlot)
class SlotAdmin(admin.ModelAdmin):
    list_display  = ('date', 'time', 'is_booked')
    list_filter   = ('is_booked',)
    ordering      = ('date', 'time')