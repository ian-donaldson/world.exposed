# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-08-25 23:52
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0003_auto_20170825_2250'),
    ]

    operations = [
        migrations.RenameField(
            model_name='csvupload',
            old_name='file',
            new_name='map_file',
        ),
    ]