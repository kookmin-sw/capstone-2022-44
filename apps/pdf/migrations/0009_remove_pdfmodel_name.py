# Generated by Django 3.2.12 on 2022-04-27 09:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pdf', '0008_alter_pdfmodel_pdf'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pdfmodel',
            name='name',
        ),
    ]
