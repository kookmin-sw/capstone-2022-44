# Generated by Django 3.2.12 on 2022-04-15 07:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdf', '0006_alter_pdfmodel_pdf'),
    ]

    operations = [
        migrations.AddField(
            model_name='pdfmodel',
            name='views',
            field=models.IntegerField(default=0),
        ),
    ]
