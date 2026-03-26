from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'analytics'

router = DefaultRouter()
router.register(r'activities', views.UserActivityViewSet, basename='activity')

urlpatterns = router.urls + [
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('analytics/overview/', views.AnalyticsView.as_view(), name='analytics-overview'),
]
