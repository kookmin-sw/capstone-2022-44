# Generated by Django 3.2.12 on 2022-04-29 06:56

from django.db import migrations, models
import user.models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_alter_user_card'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='card',
            field=models.ImageField(upload_to=user.models.card_path),
        ),
    ]
