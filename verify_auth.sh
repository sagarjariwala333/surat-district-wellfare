#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000"
USERNAME="admin"
PASSWORD="admin123"

echo "Step 1: Testing login with WRONG credentials..."
curl -i -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"admin\", \"password\": \"wrongpassword\"}"

echo -e "\n\nStep 2: Testing login with CORRECT credentials..."
curl -i -X POST "$BASE_URL/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}"

echo -e "\n\nStep 3: Testing protected route access WITHOUT session..."
curl -i "$BASE_URL/admin"

echo -e "\n\nVerification script completed."
