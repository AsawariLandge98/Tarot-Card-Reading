from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('readings', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='booking_date',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='booking',
            name='booking_time',
            field=models.TimeField(null=True, blank=True),
        ),
    ]