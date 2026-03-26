from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'queries'

router = DefaultRouter()
router.register(r'queries', views.QueryViewSet, basename='query')

urlpatterns = router.urls + [
    path(
        'queries/<int:query_id>/documents/',
        views.QueryDocumentListView.as_view(),
        name='query-documents',
    ),
]
