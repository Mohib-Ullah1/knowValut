"""
URL configuration for KnowVault AI project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Landing page
    path('', TemplateView.as_view(template_name='index.html'), name='home'),

    # Authentication pages
    path('auth/login/', TemplateView.as_view(template_name='auth/login.html'), name='login'),
    path('auth/register/', TemplateView.as_view(template_name='auth/register.html'), name='register'),
    path('auth/forgot-password/', TemplateView.as_view(template_name='auth/forgot-password.html'), name='forgot-password'),
    path('auth/mfa-setup/', TemplateView.as_view(template_name='auth/mfa-setup.html'), name='mfa-setup'),

    # Dashboard pages
    path('dashboard/', TemplateView.as_view(template_name='dashboard/dashboard.html'), name='dashboard'),
    path('dashboard/analytics/', TemplateView.as_view(template_name='dashboard/analytics.html'), name='analytics'),
    path('dashboard/reports/', TemplateView.as_view(template_name='dashboard/reports.html'), name='reports'),

    # Document pages
    path('documents/', TemplateView.as_view(template_name='documents/documents.html'), name='documents'),
    path('documents/upload/', TemplateView.as_view(template_name='documents/upload.html'), name='upload'),
    path('documents/viewer/', TemplateView.as_view(template_name='documents/viewer.html'), name='viewer'),

    # Query pages
    path('query/chat/', TemplateView.as_view(template_name='query/chat.html'), name='chat'),
    path('query/search/', TemplateView.as_view(template_name='query/search.html'), name='search'),
    path('query/history/', TemplateView.as_view(template_name='query/history.html'), name='history'),

    # Settings pages
    path('settings/', TemplateView.as_view(template_name='settings/settings.html'), name='settings'),
    path('settings/organization/', TemplateView.as_view(template_name='settings/organization.html'), name='organization'),
    path('settings/security/', TemplateView.as_view(template_name='settings/security.html'), name='security'),

    # API endpoints
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.documents.urls')),
    path('api/', include('apps.queries.urls')),
    path('api/', include('apps.analytics.urls')),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

# Serve static and media files in development
if settings.DEBUG:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
