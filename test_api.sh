#!/bin/bash
# test_api.sh

echo "=== XBRL API Docker Testing ==="

# 1. Ensure Docker Compose environment is running
echo "Starting Docker Compose services..."
docker-compose up -d postgres ferretdb

# 2. Wait for database to be ready
echo "Waiting for database to initialize..."
sleep 5

# 3. Start the API service
echo "Starting API service..."
docker-compose up -d deno-api

# 4. Wait for API to be ready
echo "Waiting for API service to start..."
sleep 3

# 5. Run tests
echo "Running API tests..."
docker-compose exec deno-api deno run --allow-net /app/test_api.ts

# 6. Provide option to stop services
read -p "Tests completed. Stop services? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  docker-compose stop deno-api
  echo "API service stopped."
fi

echo "Testing complete."