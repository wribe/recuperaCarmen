#!/bin/bash

# Script para instalar dependencias del servidor Stripe

echo "📦 Instalando dependencias para el servidor Stripe..."

# Instalar dependencias globalmente o localmente
npm install --save-dev express cors dotenv stripe

if [ $? -eq 0 ]; then
    echo "✓ Dependencias instaladas correctamente"
    echo ""
    echo "🚀 Para ejecutar el servidor de Stripe:"
    echo "   npm run stripe"
    echo ""
    echo "O ejecutar directamente:"
    echo "   node backend/stripe-server.js"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi
