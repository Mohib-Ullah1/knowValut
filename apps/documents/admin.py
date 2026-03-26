from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'file_type', 'file_size', 'status', 'uploaded_by', 'created_at']
    list_filter = ['status', 'file_type', 'created_at']
    search_fields = ['title', 'uploaded_by__username']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('uploaded_by')
