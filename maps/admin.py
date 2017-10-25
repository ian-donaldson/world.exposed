from django.contrib import admin
from .models import (Map, CSVUpload)

# Register your models here.
class MapModelAdmin(admin.ModelAdmin):
	list_display = [
		"x",
		"y",
		"z",
		]

	list_display_links = [
		"x",
        "y",
        "z",
		]

	class Meta:
		model = Map


admin.site.register(Map, MapModelAdmin)
admin.site.register(CSVUpload)
