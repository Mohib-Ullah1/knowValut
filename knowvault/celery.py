import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'knowvault.settings')

app = Celery('knowvault')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
