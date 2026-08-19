from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Product

# Create your views here.

@csrf_exempt
def warehouse_webhook(request):
    try:
        data = json.loads(request.body)
        sku = data.get("sku")
        new_stock = data.get("stock_count")

        if not sku or new_stock is None:
            return JsonResponse({"error": "Missing sku or stock_count"}, status=400)

        product, created = Product.objects.get_or_create(
            sku = sku,
            defaults={"name": f"Product {sku}", "stock_count": new_stock}
        )

        if not created:
            product.stock_count = new_stock
            product.save()

        return JsonResponse({
            "status": "success",
            "message": f"Updated {product.sku} stock to {product.stock_count}"
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"Error": "Invalid JSON"}, status=400)