# Generated by Django 4.0.3 on 2022-04-29 10:47

import datetime
from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):

    dependencies = [
        ('eyetracking', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='eyetracking',
            name='create_date',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
