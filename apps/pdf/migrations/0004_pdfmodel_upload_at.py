# Generated by Django 3.2.12 on 2022-04-15 07:45

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('pdf', '0003_alter_pdfmodel_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='pdfmodel',
            name='upload_at',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]