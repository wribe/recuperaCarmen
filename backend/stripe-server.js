/**
 * Servidor backend para procesar pagos con Stripe
 * Puerto: 3001
 * 
 * Para ejecutar:
 * npm install express cors dotenv stripe
 * node backend/stripe-server.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Importar Stripe (opcional si tienes claves reales)
let stripe = null;
try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && stripeKey !== 'sk_test_your_secret_key') {
        const Stripe = require('stripe');
        stripe = Stripe(stripeKey);
        console.log('✓ Stripe inicializado con claves reales');
    } else {
        console.log('⚠ Stripe en modo simulación (sin claves reales)');
    }
} catch (error) {
    console.log('⚠ Stripe no disponible, usando modo simulación');
}

// ========================= RUTAS =========================

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor Stripe funcionando' });
});

/**
 * Crear sesión de checkout
 */
app.post('/create-checkout-session', async (req, res) => {
    const { factura, amount, currency } = req.body;

    try {
        console.log(`📝 Solicitud de pago recibida:`, {
            factura: factura.numeroFactura,
            cliente: factura.cliente,
            monto: amount,
            moneda: currency
        });

        // Si tenemos Stripe con claves reales
        if (stripe) {
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
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/facturas?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/facturas?canceled=true`,
            });

            console.log(`✓ Sesión Stripe creada:`, session.id);
            return res.json(session);
        }

        // Modo simulación (sin claves reales)
        const simulatedSession = {
            id: `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            payment_status: 'unpaid',
            payment_intent: `pi_test_${Date.now()}`,
            client_secret: `cs_test_secret_${Date.now()}`,
            url: `https://checkout.stripe.com/pay/${Date.now()}`,
            amount_total: amount,
            currency: currency || 'eur',
            customer_email: null,
            metadata: {
                factura: factura.numeroFactura,
                cliente: factura.cliente
            },
            // Importante: esto es solo para simulación
            mode: 'SIMULATION',
        };

        console.log(`✓ Sesión simulada creada:`, simulatedSession.id);
        res.json(simulatedSession);

    } catch (error) {
        console.error('❌ Error al crear sesión:', error.message);
        res.status(500).json({ 
            error: error.message,
            code: error.code
        });
    }
});

/**
 * Verificar pago
 */
app.post('/verify-payment', async (req, res) => {
    const { sessionId } = req.body;

    try {
        console.log(`🔍 Verificando pago:`, sessionId);

        if (stripe) {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            
            res.json({ 
                success: session.payment_status === 'paid',
                payment_status: session.payment_status,
                amount_total: session.amount_total,
                currency: session.currency
            });
        } else {
            // Simulación: siempre retorna pagado
            res.json({ 
                success: true,
                payment_status: 'paid',
                amount_total: req.body.amount || 0,
                currency: 'eur',
                mode: 'SIMULATION'
            });
        }
    } catch (error) {
        console.error('❌ Error al verificar pago:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Webhook de Stripe (para confirmación real de pagos)
 */
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!stripe) {
        console.log('⚠ Webhook recibido pero Stripe no está configurado');
        return res.json({ received: true });
    }

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        console.log(`📦 Webhook recibido:`, event.type);

        switch (event.type) {
            case 'checkout.session.completed':
                console.log('✓ Pago completado:', event.data.object.id);
                break;
            case 'payment_intent.succeeded':
                console.log('✓ Intención de pago exitosa:', event.data.object.id);
                break;
            case 'payment_intent.payment_failed':
                console.log('❌ Pago fallido:', event.data.object.id);
                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error('❌ Error en webhook:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

/**
 * Información del servidor
 */
app.get('/info', (req, res) => {
    res.json({
        name: 'Servidor Stripe',
        version: '1.0.0',
        port: process.env.PORT || 3001,
        stripe_configured: !!stripe,
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            health: 'GET /health',
            create_session: 'POST /create-checkout-session',
            verify_payment: 'POST /verify-payment',
            webhook: 'POST /webhook',
            info: 'GET /info'
        }
    });
});

// ========================= SERVIDOR =========================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('\n🚀 Servidor Stripe iniciado');
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`✓ Estado: ${stripe ? 'Con claves reales de Stripe' : 'En modo simulación'}`);
    console.log('\n📋 Endpoints disponibles:');
    console.log('   GET  /health');
    console.log('   POST /create-checkout-session');
    console.log('   POST /verify-payment');
    console.log('   POST /webhook');
    console.log('   GET  /info');
    console.log('\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});
