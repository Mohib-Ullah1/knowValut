from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from apps.analytics.models import UserActivity
from .models import Document
from .serializers import DocumentSerializer, DocumentUploadSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        qs = Document.objects.filter(
            uploaded_by=self.request.user
        ).select_related('uploaded_by')

        # Filtering
        params = self.request.query_params
        if status_filter := params.get('status'):
            qs = qs.filter(status=status_filter)
        if file_type := params.get('file_type'):
            qs = qs.filter(file_type=file_type)
        if search := params.get('search'):
            qs = qs.filter(Q(title__icontains=search))

        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentUploadSerializer
        return DocumentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        document = serializer.save()

        UserActivity.objects.create(
            user=request.user,
            action='upload',
            metadata={'document_id': document.id, 'title': document.title},
        )

        # Trigger async processing if Celery is available
        try:
            from .tasks import process_document
            process_document.delay(document.id)
        except Exception:
            # Celery not running — mark as completed directly
            document.status = 'completed'
            document.save(update_fields=['status'])

        return Response(
            DocumentSerializer(document, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        UserActivity.objects.create(
            user=request.user,
            action='view',
            metadata={'document_id': instance.id, 'title': instance.title},
        )
        return Response(self.get_serializer(instance).data)

    def perform_destroy(self, instance):
        # Delete the actual file from storage
        if instance.file:
            instance.file.delete(save=False)
        instance.delete()
