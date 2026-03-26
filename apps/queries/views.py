from rest_framework import generics, mixins, viewsets, status
from rest_framework.response import Response

from apps.analytics.models import UserActivity
from .models import Query, QueryDocument
from .serializers import QuerySerializer, QueryCreateSerializer, QueryDocumentSerializer


class QueryViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = QuerySerializer

    def get_queryset(self):
        qs = Query.objects.filter(
            user=self.request.user,
        ).select_related('user').prefetch_related('query_documents__document')

        if search := self.request.query_params.get('search'):
            qs = qs.filter(query_text__icontains=search)

        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return QueryCreateSerializer
        return QuerySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        query = serializer.save()

        UserActivity.objects.create(
            user=request.user,
            action='query',
            metadata={'query_id': query.id, 'text': query.query_text[:100]},
        )

        return Response(
            QuerySerializer(query).data,
            status=status.HTTP_201_CREATED,
        )


class QueryDocumentListView(generics.ListAPIView):
    serializer_class = QueryDocumentSerializer

    def get_queryset(self):
        return QueryDocument.objects.filter(
            query_id=self.kwargs['query_id'],
            query__user=self.request.user,
        ).select_related('document').order_by('-relevance_score')
