from django.contrib import admin
from .models import Product

# Register your models here.
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'stock_count', 'updated_at')
    search_fields = ('sku', 'name')
    list_filter = ('updated_at',)
    ordering = ('sku',)