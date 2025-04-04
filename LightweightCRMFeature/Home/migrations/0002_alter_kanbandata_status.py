# Generated by Django 5.1.5 on 2025-04-01 19:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Home", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="kanbandata",
            name="status",
            field=models.CharField(
                choices=[
                    ("new", "New"),
                    ("contacted", "Contacted"),
                    ("qualified", "Qualified"),
                    ("lost", "Lost"),
                ],
                default="new",
                max_length=20,
            ),
        ),
    ]
