from rest_framework import serializers
from .models import UserActivity


class UserActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'username', 'action', 'metadata', 'created_at']
        read_only_fields = fields


class DashboardStatsSerializer(serializers.Serializer):
    total_documents = serializers.IntegerField()
    total_queries = serializers.IntegerField()
    recent_activity_count = serializers.IntegerField()
    documents_by_status = serializers.DictField(child=serializers.IntegerField())
    storage_used = serializers.IntegerField()


class AnalyticsOverviewSerializer(serializers.Serializer):
    queries_per_day = serializers.ListField(child=serializers.DictField())
    documents_per_day = serializers.ListField(child=serializers.DictField())
    top_actions = serializers.ListField(child=serializers.DictField())
    activity_by_hour = serializers.ListField(child=serializers.DictField())
