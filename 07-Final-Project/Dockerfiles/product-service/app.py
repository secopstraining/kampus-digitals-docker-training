from flask import Flask, jsonify
import os
import json
import redis

app = Flask(__name__)

# Redis connection
redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'redis'),
    port=6379,
    decode_responses=True
)

# Sample products
PRODUCTS = [
    {"id": 1, "name": "Laptop", "price": 999.99, "stock": 50},
    {"id": 2, "name": "Smartphone", "price": 699.99, "stock": 100},
    {"id": 3, "name": "Headphones", "price": 149.99, "stock": 200},
    {"id": 4, "name": "Keyboard", "price": 79.99, "stock": 150},
    {"id": 5, "name": "Mouse", "price": 49.99, "stock": 300},
]

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "product-service"})

@app.route('/api/products')
def get_products():
    # Try to get from cache
    cached = redis_client.get('products')
    if cached:
        return jsonify({"source": "cache", "products": json.loads(cached)})

    # Cache miss - store in Redis
    redis_client.setex('products', 60, json.dumps(PRODUCTS))
    return jsonify({"source": "database", "products": PRODUCTS})

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
