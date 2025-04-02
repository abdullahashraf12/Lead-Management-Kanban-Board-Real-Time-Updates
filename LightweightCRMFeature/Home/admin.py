from django.contrib import admin
from .models import KanBanData

@admin.register(KanBanData)
class KanBanDataAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'company', 'created_at')
    search_fields = ('name', 'email', 'company', 'phone', 'notes')
    list_per_page = 25
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'company')
        }),
        ('Status Information', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')