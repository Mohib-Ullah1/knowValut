from django.db import models
from django.conf import settings

class Query(models.Model):
    """Query model for storing user queries and AI responses"""
    query_text = models.TextField()
    response_text = models.TextField(blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='queries')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'queries'
        ordering = ['-created_at']
        verbose_name = 'Query'
        verbose_name_plural = 'Queries'
    
    def __str__(self):
        return f"{self.user.username} - {self.query_text[:50]}"

class QueryDocument(models.Model):
    """Many-to-many relationship between queries and documents"""
    query = models.ForeignKey('Query', on_delete=models.CASCADE, related_name='query_documents')
    document = models.ForeignKey('documents.Document', on_delete=models.CASCADE, related_name='query_documents')
    relevance_score = models.FloatField(default=0.0)
    
    class Meta:
        db_table = 'query_documents'
        unique_together = ['query', 'document']
