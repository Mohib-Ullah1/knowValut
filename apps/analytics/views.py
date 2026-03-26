from datetime import timedelta
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate, TruncHour
from django.utils import timezone
from rest_framework import mixins, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.documents.models import Document
from apps.queries.models import Query
from .models import UserActivity
from .serializers import (
    UserActivitySerializer,
    DashboardStatsSerializer,
    AnalyticsOverviewSerializer,
)


class UserActivityViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = UserActivitySerializer

    def get_queryset(self):
        qs = UserActivity.objects.filter(
            user=self.request.user,
        ).select_related('user')

        params = self.request.query_params
        if action := params.get('action'):
            qs = qs.filter(action=action)
        if days := params.get('days'):
            try:
                since = timezone.now() - timedelta(days=int(days))
                qs = qs.filter(created_at__gte=since)
            except (ValueError, TypeError):
                pass

        return qs


class DashboardStatsView(APIView):
    def get(self, request):
        user = request.user
        now = timezone.now()
        seven_days_ago = now - timedelta(days=7)

        total_documents = Document.objects.filter(uploaded_by=user).count()
        total_queries = Query.objects.filter(user=user).count()
        recent_activity_count = UserActivity.objects.filter(
            user=user, created_at__gte=seven_days_ago,
        ).count()

        documents_by_status = dict(
            Document.objects.filter(uploaded_by=user)
            .values_list('status')
            .annotate(count=Count('id'))
            .values_list('status', 'count')
        )

        storage_used = Document.objects.filter(
            uploaded_by=user,
        ).aggregate(total=Sum('file_size'))['total'] or 0

        data = {
            'total_documents': total_documents,
            'total_queries': total_queries,
            'recent_activity_count': recent_activity_count,
            'documents_by_status': documents_by_status,
            'storage_used': storage_used,
        }
        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)


class AnalyticsView(APIView):
    def get(self, request):
        user = request.user
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        queries_per_day = list(
            Query.objects.filter(user=user, created_at__gte=thirty_days_ago)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        documents_per_day = list(
            Document.objects.filter(uploaded_by=user, created_at__gte=thirty_days_ago)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        top_actions = list(
            UserActivity.objects.filter(user=user, created_at__gte=thirty_days_ago)
            .values('action')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        activity_by_hour = list(
            UserActivity.objects.filter(user=user, created_at__gte=thirty_days_ago)
            .annotate(hour=TruncHour('created_at'))
            .values('hour')
            .annotate(count=Count('id'))
            .order_by('hour')
        )

        data = {
            'queries_per_day': queries_per_day,
            'documents_per_day': documents_per_day,
            'top_actions': top_actions,
            'activity_by_hour': activity_by_hour,
        }
        serializer = AnalyticsOverviewSerializer(data)
        return Response(serializer.data)
