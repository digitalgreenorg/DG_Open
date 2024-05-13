# Generated by Django 4.0.5 on 2023-04-11 05:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datahub', '0025_remove_datasetv2file_accessibility'),
    ]

    operations = [
        migrations.AddField(
            model_name='datasetv2file',
            name='accessibility',
            field=models.CharField(choices=[('public', 'public'), ('registered', 'registered'), ('private', 'private')], default='public', max_length=255, null=True),
        ),
    ]