from rest_framework import serializers
from .models import Query, QueryDocument


class QueryDocumentSerializer(serializers.ModelSerializer):
    document_title = serializers.CharField(source='document.title', read_only=True)
    document_type = serializers.CharField(source='document.file_type', read_only=True)

    class Meta:
        model = QueryDocument
        fields = ['id', 'document', 'document_title', 'document_type', 'relevance_score']
        read_only_fields = fields


class QuerySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    sources = QueryDocumentSerializer(source='query_documents', many=True, read_only=True)

    class Meta:
        model = Query
        fields = [
            'id', 'query_text', 'response_text', 'user',
            'username', 'sources', 'created_at',
        ]
        read_only_fields = ['id', 'response_text', 'user', 'created_at']


class QueryCreateSerializer(serializers.Serializer):
    query_text = serializers.CharField(max_length=2000)

    def create(self, validated_data):
        user = self.context['request'].user
        # Stub AI response - replace with actual AI integration
        response_text = (
            "This is a placeholder response. The AI query engine is not yet configured. "
            "Once integrated, this will return intelligent answers based on your uploaded documents."
        )
        return Query.objects.create(
            query_text=validated_data['query_text'],
            response_text=response_text,
            user=user,
        )
