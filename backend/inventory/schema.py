import strawberry
from typing import List
from .models import Product

@strawberry.type
class ProductType:
    id: int
    sku: str
    name: str
    stock_count: int

@strawberry.type
class Query:
    @strawberry.field
    def get_products(self) -> List[ProductType]:
        # Make sure this is Product.objects.all() - with an 's'
        return Product.objects.all()

    @strawberry.field
    def get_product_by_sku(self, sku: str) -> ProductType:
        # Make sure this is Product.objects.get(...) - with an 's'
        return Product.objects.get(sku=sku)

schema = strawberry.Schema(query=Query)