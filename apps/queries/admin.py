from django.contrib import admin
from .models import Query, QueryDocument

@admin.register(Query)
class QueryAdmin(admin.ModelAdmin):
    list_display = ['user', 'query_text_short', 'created_at']
    list_filter = ['created_at']
    search_fields = ['query_text', 'response_text', 'user__username']
    readonly_fields = ['created_at']
    
    def query_text_short(self, obj):
        return obj.query_text[:50] + '...' if len(obj.query_text) > 50 else obj.query_text
    query_text_short.short_description = 'Query'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')

@admin.register(QueryDocument)
class QueryDocumentAdmin(admin.ModelAdmin):
    list_display = ['query', 'document', 'relevance_score']
    list_filter = ['relevance_score']
    search_fields = ['query__query_text', 'document__title']
