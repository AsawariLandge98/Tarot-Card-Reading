from django.urls import path
from . import views

urlpatterns = [
    path('bookings/',                    views.bookings_list),
    path('bookings/<int:pk>/',           views.booking_detail),
    path('inquiries/',                   views.inquiries_list),
    path('inquiries/<int:pk>/',          views.inquiry_detail),
    path('inquiries/<int:pk>/reply/',    views.inquiry_reply),
    path('slots/',                       views.slots_list),
    path('slots/<int:pk>/',              views.slot_detail),
    path('dashboard/stats/',             views.dashboard_stats),
]