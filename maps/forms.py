from django.forms import ModelForm
from .models import CSVUpload

class LayerForm(ModelForm):
	class Meta:
		model = CSVUpload
		fields = [
			'map_file',
		]
