# Generated by Django 4.1.5 on 2024-01-25 06:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("datahub", "0067_alter_resourceusagepolicy_type_messages"),
    ]

    operations = [
        migrations.AlterField(
            model_name="messages",
            name="retrieved_chunks",
            field=models.ManyToManyField(null=True, to="datahub.langchainpgembedding"),
        ),
    ]