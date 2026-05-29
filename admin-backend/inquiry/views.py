from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Booking, Inquiry, AvailableSlot
from .serializers import BookingSerializer, InquirySerializer, AvailableSlotSerializer
import datetime

# ─────────────────────────── BOOKINGS ───────────────────────────

@api_view(['GET', 'POST'])
def bookings_list(request):
    if request.method == 'GET':
        qs = Booking.objects.all()
        # filters
        status_f = request.GET.get('status')
        date_f   = request.GET.get('date')
        type_f   = request.GET.get('reading_type')
        q_f      = request.GET.get('q')
        if status_f: qs = qs.filter(status=status_f)
        if date_f:   qs = qs.filter(booking_date=date_f)
        if type_f:   qs = qs.filter(reading_type=type_f)
        if q_f:      qs = qs.filter(
            Q(client_name__icontains=q_f)|Q(email__icontains=q_f)|Q(phone__icontains=q_f))
        return Response(BookingSerializer(qs, many=True).data)

    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        obj = serializer.save()
        # mark slot as booked
        try:
            slot = AvailableSlot.objects.get(date=obj.booking_date, time=obj.booking_time)
            slot.is_booked = True
            slot.save()
        except AvailableSlot.DoesNotExist:
            pass
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def booking_detail(request, pk):
    try:
        obj = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        return Response(BookingSerializer(obj).data)

    if request.method in ('PUT', 'PATCH'):
        serializer = BookingSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ─────────────────────────── INQUIRIES ───────────────────────────

@api_view(['GET', 'POST'])
def inquiries_list(request):
    if request.method == 'GET':
        qs = Inquiry.objects.all()
        status_f = request.GET.get('status')
        q_f      = request.GET.get('q')
        if status_f: qs = qs.filter(status=status_f)
        if q_f:      qs = qs.filter(Q(name__icontains=q_f)|Q(email__icontains=q_f)|Q(message__icontains=q_f))
        return Response(InquirySerializer(qs, many=True).data)

    serializer = InquirySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def inquiry_detail(request, pk):
    try:
        obj = Inquiry.objects.get(pk=pk)
    except Inquiry.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        return Response(InquirySerializer(obj).data)

    if request.method in ('PUT', 'PATCH'):
        serializer = InquirySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    obj.delete()
    return Response(status=204)


# ─────────────────────────── SLOTS ───────────────────────────

@api_view(['GET', 'POST'])
def slots_list(request):
    if request.method == 'GET':
        today = datetime.date.today()
        qs = AvailableSlot.objects.filter(date__gte=today)
        # public endpoint: only show open slots
        if request.GET.get('open') == '1':
            qs = qs.filter(is_booked=False)
        return Response(AvailableSlotSerializer(qs, many=True).data)

    serializer = AvailableSlotSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def slot_detail(request, pk):
    try:
        obj = AvailableSlot.objects.get(pk=pk)
    except AvailableSlot.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        return Response(AvailableSlotSerializer(obj).data)

    if request.method in ('PUT', 'PATCH'):
        serializer = AvailableSlotSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    obj.delete()
    return Response(status=204)


# ─────────────────────────── STATS (dashboard) ───────────────────────────

@api_view(['GET'])
def dashboard_stats(request):
    today = datetime.date.today()
    bookings = Booking.objects.all()
    inquiries = Inquiry.objects.all()

    # recent 5 bookings
    recent_bookings = BookingSerializer(bookings[:5], many=True).data
    # recent 5 inquiries
    recent_inquiries = InquirySerializer(inquiries[:5], many=True).data

    # reading type breakdown
    from django.db.models import Count
    type_breakdown = list(
        bookings.values('reading_type').annotate(count=Count('id')).order_by('-count')
    )

    data = {
        'total_bookings':    bookings.count(),
        'pending_bookings':  bookings.filter(status='pending').count(),
        'confirmed_bookings':bookings.filter(status='confirmed').count(),
        'completed_bookings':bookings.filter(status='completed').count(),
        'total_inquiries':   inquiries.count(),
        'new_inquiries':     inquiries.filter(status='new').count(),
        'open_slots':        AvailableSlot.objects.filter(date__gte=today, is_booked=False).count(),
        'recent_bookings':   recent_bookings,
        'recent_inquiries':  recent_inquiries,
        'type_breakdown':    type_breakdown,
    }
    return Response(data)