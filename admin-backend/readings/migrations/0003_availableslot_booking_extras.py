from django.db import migrations, models
from django.utils import timezone


class Migration(migrations.Migration):

    dependencies = [
        ('readings', '0002_reading_rename_name_booking_client_name_and_more'),
    ]

    operations = [
        # Add back email
        migrations.AddField(
            model_name='booking',
            name='email',
            field=models.EmailField(default='', max_length=254),
        ),
        # Phone
        migrations.AddField(
            model_name='booking',
            name='phone',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
        # Amount
        migrations.AddField(
            model_name='booking',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        # Notes
        migrations.AddField(
            model_name='booking',
            name='notes',
            field=models.TextField(blank=True, default=''),
        ),
        # created_at — fixed: null=True so existing rows don't need a value
        migrations.AddField(
            model_name='booking',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        # Status choices
        migrations.AlterField(
            model_name='booking',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Pending'),
                    ('confirmed', 'Confirmed'),
                    ('completed', 'Completed'),
                    ('cancelled', 'Cancelled'),
                ],
                default='pending',
                max_length=20,
            ),
        ),
        migrations.AlterModelOptions(
            name='booking',
            options={'ordering': ['-created_at']},
        ),
        # Inquiry status
        migrations.AddField(
            model_name='inquiry',
            name='status',
            field=models.CharField(
                choices=[
                    ('new', 'New'),
                    ('replied', 'Replied'),
                    ('archived', 'Archived'),
                ],
                default='new',
                max_length=20,
            ),
        ),
        migrations.AlterModelOptions(
            name='inquiry',
            options={'ordering': ['-created_at']},
        ),
        # AvailableSlot table
        migrations.CreateModel(
            name='AvailableSlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('reading_type', models.CharField(blank=True, default='', max_length=100)),
                ('is_booked', models.BooleanField(default=False)),
                ('max_bookings', models.PositiveSmallIntegerField(default=1)),
                ('notes', models.CharField(blank=True, default='', max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={'ordering': ['date', 'time']},
        ),
        migrations.AlterUniqueTogether(
            name='availableslot',
            unique_together={('date', 'time')},
        ),
    ]