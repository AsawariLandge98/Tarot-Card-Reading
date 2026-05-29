from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from .models import Booking, Inquiry, AvailableSlot
from .serializers import BookingSerializer, InquirySerializer, AvailableSlotSerializer
import datetime
import threading


# ─────────────────────────── EMAIL HELPERS ───────────────────────────

def fmt_date(d):
    """Format date nicely: 25 May 2026"""
    try:
        if isinstance(d, str):
            d = datetime.date.fromisoformat(d)
        return d.strftime('%-d %B %Y')
    except Exception:
        return str(d)

def fmt_time(t):
    """Format time nicely: 3:00 PM"""
    try:
        if isinstance(t, str):
            h, m = t.split(':')[:2]
            h = int(h)
        else:
            h, m = t.hour, t.minute
        ampm = 'PM' if h >= 12 else 'AM'
        h12 = h - 12 if h > 12 else (12 if h == 0 else h)
        return f'{h12}:{str(m).zfill(2)} {ampm}'
    except Exception:
        return str(t)

def send_booking_emails(booking):
    """
    Send two emails when a new booking is created:
    1. Client — Thank you / confirmation
    2. Annie ji — New booking alert
    """
    date_str = fmt_date(booking.booking_date)
    time_str = fmt_time(booking.booking_time)
    annie_email = getattr(settings, 'ANNIE_EMAIL', settings.EMAIL_HOST_USER)

    # ── 1. Client email ──
    client_subject = f'Your reading with Astro Annie is confirmed — {date_str}'
    client_body = f"""Namaste {booking.client_name} ji,

Thank you for booking a reading with Astro Annie. 🙏

Here are your booking details:

  Reading type : {booking.reading_type}
  Date         : {date_str}
  Time         : {time_str} (IST)
  Status       : Pending confirmation

Annie ji will confirm your slot shortly via WhatsApp or reply to this email.

If you need to reschedule or have any questions, simply WhatsApp:
  +91 81789 73198

Looking forward to sitting with you.

With light,
Astro Annie
astroanjilina.com
"""
    try:
        send_mail(
            subject=client_subject,
            message=client_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.email],
            fail_silently=True,
        )
    except Exception:
        pass

    # ── 2. Annie ji notification email ──
    annie_subject = f'New Booking — {booking.client_name} on {date_str}'
    notes_line = f'\n  Notes        : {booking.notes}' if booking.notes else ''
    annie_body = f"""New booking received on the website.

  Client       : {booking.client_name}
  Email        : {booking.email}
  Phone        : {booking.phone or '—'}
  Reading type : {booking.reading_type}
  Date         : {date_str}
  Time         : {time_str}{notes_line}
  Status       : Pending

Go to admin panel to confirm or manage:
  http://127.0.0.1:5500/frontend_admin copy/src/Bookings.html
"""
    try:
        send_mail(
            subject=annie_subject,
            message=annie_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[annie_email],
            fail_silently=True,
        )
    except Exception:
        pass


def send_status_change_email(booking, new_status):
    """Send email to client when admin changes booking status."""
    if not booking.email:
        return

    date_str = fmt_date(booking.booking_date)
    time_str = fmt_time(booking.booking_time)

    status_messages = {
        'confirmed': {
            'subject': f'Booking Confirmed — {date_str} with Astro Annie',
            'body': f"""Namaste {booking.client_name} ji,

Great news! Your reading has been confirmed. ✨

  Reading type : {booking.reading_type}
  Date         : {date_str}
  Time         : {time_str} (IST)
  Status       : Confirmed ✓

Annie ji will reach out on WhatsApp before your session.
Please keep +91 81789 73198 saved.

See you at the table.

With light,
Astro Annie
""",
        },
        'cancelled': {
            'subject': f'Booking Update — Astro Annie',
            'body': f"""Namaste {booking.client_name} ji,

We regret to inform you that your booking on {date_str} at {time_str} has been cancelled.

To reschedule, please WhatsApp Annie ji at +91 81789 73198
or book again at: http://127.0.0.1:5501/tarot_output/book.html

We hope to see you soon.

With light,
Astro Annie
""",
        },
        'completed': {
            'subject': f'Thank You for Your Reading — Astro Annie',
            'body': f"""Namaste {booking.client_name} ji,

Thank you for sitting with Annie ji today. 🙏

We hope your reading brought clarity and light.

If you have any follow-up questions, WhatsApp:
  +91 81789 73198

Wishing you all the very best on your path ahead.

With love and light,
Astro Annie
astroanjilina.com
""",
        },
    }

    if new_status not in status_messages:
        return

    msg = status_messages[new_status]
    try:
        send_mail(
            subject=msg['subject'],
            message=msg['body'],
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.email],
            fail_silently=True,
        )
    except Exception:
        pass


# ─────────────────────────── BOOKINGS ───────────────────────────

@api_view(['GET', 'POST'])
def bookings_list(request):
    if request.method == 'GET':
        qs = Booking.objects.all()
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
        # Mark slot as booked
        try:
            slot = AvailableSlot.objects.get(date=obj.booking_date, time=obj.booking_time)
            slot.is_booked = True
            slot.save()
        except AvailableSlot.DoesNotExist:
            pass
        # Send emails in background — don't block response
        threading.Thread(target=send_booking_emails, args=(obj,), daemon=True).start()
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
        old_status = obj.status
        serializer = BookingSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            new_status = updated.status
            # Send email in background if status changed
            if new_status != old_status:
                threading.Thread(target=send_status_change_email, args=(updated, new_status), daemon=True).start()
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

    recent_bookings  = BookingSerializer(bookings[:5], many=True).data
    recent_inquiries = InquirySerializer(inquiries[:5], many=True).data

    from django.db.models import Count
    type_breakdown = list(
        bookings.values('reading_type').annotate(count=Count('id')).order_by('-count')
    )

    data = {
        'total_bookings':     bookings.count(),
        'pending_bookings':   bookings.filter(status='pending').count(),
        'confirmed_bookings': bookings.filter(status='confirmed').count(),
        'completed_bookings': bookings.filter(status='completed').count(),
        'total_inquiries':    inquiries.count(),
        'new_inquiries':      inquiries.filter(status='new').count(),
        'open_slots':         AvailableSlot.objects.filter(date__gte=today, is_booked=False).count(),
        'recent_bookings':    recent_bookings,
        'recent_inquiries':   recent_inquiries,
        'type_breakdown':     type_breakdown,
    }
    return Response(data)