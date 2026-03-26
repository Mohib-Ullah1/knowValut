from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'organization', 'mfa_enabled', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'mfa_enabled']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'organization']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'organization', 'mfa_enabled', 'mfa_secret')}),
    )
