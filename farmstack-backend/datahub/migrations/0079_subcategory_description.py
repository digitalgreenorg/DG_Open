# Generated by Django 4.1.5 on 2024-06-28 08:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datahub', '0078_resource_countries_resource_sub_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='subcategory',
            name='description',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
