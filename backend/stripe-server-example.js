/**
 * EJEMPLO DE BACKEND PARA PROCESAR PAGOS CON STRIPE
 * 
 * Este es un ejemplo básico usando Express.js y Stripe
 * Guarda este código en tu backend (backend/stripe-server.js o similar)
 * 
 * Para usar:
 * 1. npm install express stripe cors dotenv
 * 2. Crea un archivo .env con:
 *    STRIPE_SECRET_KEY=sk_test_your_secret_key
 *    PORT=3001
 * 3. node stripe-server.js
 

// ============================================
// OPCIÓN 1: USANDO EXPRESS.JS (Recomendado)
// ============================================

const express = require('express');
const stripe = require('stripe')('sk_test_your_secret_key');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para crear sesión de checkout
app.post('/create-checkout-session', async (req, res) => {
    console.log("¡SOY EL ARCHIVO NUMERO 1!");
    const { factura, amount, currency } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency || 'eur',
                        product_data: {
                            name: factura.numeroFactura,
                            description: `Factura para ${factura.cliente}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/facturas?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/facturas?canceled=true`,
        });

        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para verificar pago
app.post('/verify-payment', async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
            res.json({ 
                success: true, 
                message: 'Pago completado',
                amount: session.amount_total,
                currency: session.currency
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Pago no completado'
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor Stripe escuchando en puerto ${PORT}`);
});


// ============================================
// OPCIÓN 2: USANDO FASTIFY (Alternativa)
// ============================================

/*
const fastify = require('fastify');
const stripe = require('stripe')('sk_test_your_secret_key');
require('dotenv').config();

const server = fastify({
    logger: true,
});

server.register(require('@fastify/cors'));

server.post('/create-checkout-session', async (request, reply) => {
    const { factura, amount, currency } = request.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency || 'eur',
                        product_data: {
                            name: factura.numeroFactura,
                            description: `Factura para ${factura.cliente}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/facturas?success=true',
            cancel_url: 'http://localhost:5173/facturas?canceled=true',
        });

        reply.send(session);
    } catch (error) {
        reply.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
server.listen({ port: PORT }, (err, address) => {
    if (err) throw err;
    console.log(`Servidor Stripe escuchando en ${address}`);
});
*/


// ============================================
// INFORMACIÓN IMPORTANTE
// ============================================

/*
VARIABLES DE ENTORNO (.env):

STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXX
STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXX
FRONTEND_URL=http://localhost:5173
PORT=3001

INSTALACIÓN DE DEPENDENCIAS:

npm install express stripe cors dotenv

CLAVES DE PRUEBA (para desarrollo):

Tarjeta válida: 4242 4242 4242 4242
Expiración: Cualquier fecha futura
CVC: Cualquier número de 3 dígitos
Código postal: Cualquier código

Tarjeta rechazada: 4000 0000 0000 0002
Token de prueba: tok_visa
Token de rechazo: tok_chargeDeclined

PARA PRODUCCIÓN:

1. Cambia sk_test_XXXXX a sk_live_XXXXX
2. Cambia pk_test_XXXXX a pk_live_XXXXX
3. Configura URLs de éxito/cancelación reales
4. Usa HTTPS obligatoriamente
5. Almacena keys en variables de entorno seguras

DOCUMENTACIÓN:

- Stripe Checkout: https://stripe.com/docs/checkout
- API Reference: https://stripe.com/docs/api/checkout/sessions
- Manejo de errores: https://stripe.com/docs/payments/checkout/troubleshooting
*/
