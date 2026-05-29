from django.contrib import admin
from .models import Inquiry, Booking, Reading, AvailableSlot

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['client_name','email','reading_type','booking_date','booking_time','status','amount']
    list_filter = ['status','reading_type','booking_date']
    search_fields = ['client_name','email']

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['name','email','status','created_at']
    list_filter = ['status']

@admin.register(AvailableSlot)
class SlotAdmin(admin.ModelAdmin):
    list_display = ['date','time','reading_type','is_booked','max_bookings']
    list_filter = ['date','is_booked']

@admin.register(Reading)
class ReadingAdmin(admin.ModelAdmin):
    list_display = ['client_name','reading_type','created_at']