from django.db import models

class Inquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    status = models.CharField(max_length=20, default='new',
        choices=[('new','New'),('replied','Replied'),('archived','Archived')])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.status})"


class Booking(models.Model):
    STATUS = [('pending','Pending'),('confirmed','Confirmed'),
              ('completed','Completed'),('cancelled','Cancelled')]
    READING_TYPES = [
        ('Three Card','Three Card'),('Celtic Cross','Celtic Cross'),
        ('Love Reading','Love Reading'),('Career Path','Career Path'),
        ('Year Ahead','Year Ahead'),('Full Spread','Full Spread'),
        ('Numerology','Numerology'),('Lal Kitab','Lal Kitab'),('Vastu','Vastu'),
    ]
    client_name   = models.CharField(max_length=100)
    email         = models.EmailField(default='')
    phone         = models.CharField(max_length=20, blank=True, default='')
    reading_type  = models.CharField(max_length=100, choices=READING_TYPES)
    booking_date  = models.DateField()
    booking_time  = models.TimeField()
    status        = models.CharField(max_length=20, choices=STATUS, default='pending')
    amount        = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes         = models.TextField(blank=True, default='')
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.client_name} — {self.booking_date}"


class AvailableSlot(models.Model):
    date          = models.DateField()
    time          = models.TimeField()
    reading_type  = models.CharField(max_length=100, blank=True, default='')
    is_booked     = models.BooleanField(default=False)
    max_bookings  = models.PositiveSmallIntegerField(default=1)
    notes         = models.CharField(max_length=200, blank=True, default='')
    created_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time']
        unique_together = ['date', 'time']

    def __str__(self):
        return f"{self.date} {self.time} {'✓booked' if self.is_booked else 'open'}"