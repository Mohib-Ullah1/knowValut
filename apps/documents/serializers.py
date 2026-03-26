import os
from django.conf import settings
from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'file', 'file_url', 'file_type', 'file_size',
            'status', 'uploaded_by', 'uploaded_by_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'file_type', 'file_size', 'status',
            'uploaded_by', 'created_at', 'updated_at',
        ]

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.get_full_name() or obj.uploaded_by.username

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class DocumentUploadSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, required=False)
    file = serializers.FileField()

    def validate_file(self, value):
        max_size = getattr(settings, 'FILE_UPLOAD_MAX_MEMORY_SIZE', 52428800)
        if value.size > max_size:
            raise serializers.ValidationError(
                f"File size exceeds the {max_size // (1024 * 1024)}MB limit."
            )

        allowed_extensions = [
            '.pdf', '.doc', '.docx', '.txt', '.md',
            '.xlsx', '.xls', '.pptx', '.ppt',
        ]
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"File type '{ext}' is not supported. "
                f"Allowed: {', '.join(allowed_extensions)}"
            )
        return value

    def create(self, validated_data):
        file = validated_data['file']
        title = validated_data.get('title') or os.path.splitext(file.name)[0]
        ext = os.path.splitext(file.name)[1].lower().lstrip('.')
        user = self.context['request'].user

        return Document.objects.create(
            title=title,
            file=file,
            file_type=ext,
            file_size=file.size,
            status='processing',
            uploaded_by=user,
        )


class DocumentListFilterSerializer(serializers.Serializer):
    """Query parameter validation for document listing."""
    status = serializers.ChoiceField(
        choices=['processing', 'completed', 'failed'],
        required=False,
    )
    file_type = serializers.CharField(required=False)
    search = serializers.CharField(required=False)
