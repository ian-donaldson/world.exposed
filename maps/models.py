from __future__ import unicode_literals
import csv
import io
from django.conf import settings
from django.db import models
from django.db.models.signals import post_save, pre_save
from django.db import models
from django.utils.text import slugify

from maps.signals import csv_uploaded
from maps.validators import csv_file_validator

class Map(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    x_origin = models.FloatField()
    y_origin = models.FloatField()
    x_extent = models.FloatField()
    y_extent = models.FloatField()
    x_mesh_size = models.FloatField()
    y_mesh_size = models.FloatField()
    rotation = models.FloatField()
    description = models.CharField(max_length=200)
    last_updated = models.DateTimeField(auto_now=True, auto_now_add=False)

def upload_csv_file(instance, filename):
    qs = instance.__class__.objects.filter(user=instance.user)
    if qs.exists():
        num_ = qs.last().id + 1
    else:
        num_ = 1
    return f'csv/{num_}/{instance.user.username}/{filename}'

class CSVUpload(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL)
    map_file        = models.FileField(upload_to=upload_csv_file, validators=[csv_file_validator])
    completed   = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


def convert_header(csvHeader):
    header_ = csvHeader[0]
    cols = [x.replace(' ', '_').lower() for x in header_.split(",")]
    return cols


def csv_upload_post_save(sender, instance, created, *args, **kwargs):
    if not instance.completed:
        csv_file = instance.map_file
        decoded_file = csv_file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.reader(io_string, delimiter=';', quotechar='|')
        header_ = next(reader)
        header_cols = convert_header(header_)
        parsed_items = []

        for line in reader:
            new_obj = Map()
            i = 0
            row_item = line[0].split(',')
            for item in row_item:
                key = header_cols[i]
                setattr(new_obj, key, item)
                i+=1
            new_obj.save()
        # new_map = Map.objects.bulk_create([Map(
        #     x=row[0],
        #     y=row[1],
        #     z=row[2],
        #     x_origin=row[3],
        #     y_origin=row[4],
        #     x_extent=row[5],
        #     y_extent=row[6],
        #     x_mesh_size=row[7],
        #     y_mesh_size=row[8],
        #     rotation=row[9],
        #     description=row[10],
        #     last_updated=row[11],)
        #     for row in reader])
        # new_map.save()

post_save.connect(csv_upload_post_save, sender=CSVUpload)
