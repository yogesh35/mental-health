#!/bin/bash

echo "🚂 Railway Deployment Helper"
echo "=============================="

echo "1. Make sure you have:"
echo "   ✅ Railway account created"
echo "   ✅ MySQL database provisioned"
echo "   ✅ GitHub repo connected"
echo ""

echo "2. Set these environment variables in Railway:"
echo "   - DB_HOST (from MySQL service)"
echo "   - DB_USER (from MySQL service)"
echo "   - DB_PASSWORD (from MySQL service)"
echo "   - DB_NAME (from MySQL service)"
echo "   - All your API keys"
echo ""

echo "3. After deployment, seed your database:"
echo "   Visit: https://your-app.up.railway.app/api/debug/seed"
echo ""

echo "4. Your app will be available at:"
echo "   https://your-app.up.railway.app"
echo ""

echo "Need help? Check Railway docs: https://docs.railway.app"