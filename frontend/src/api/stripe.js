// Configuración de Stripe
// Para usar Stripe, necesita:
// 1. Una cuenta en https://stripe.com
// 2. Su clave pública de Stripe
// 3. Su clave secreta en el backend

// IMPORTANTE: Reemplaza 'pk_test_YOUR_PUBLIC_KEY' con tu clave pública de Stripe
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY 

export const stripeConfig = {
    publicKey: STRIPE_PUBLIC_KEY,
    apiVersion: '2023-10-16',
};

/**
 * Inicializar Stripe
 */
export const initializeStripe = async () => {
    if (!window.Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
            script.onload = () => {
                resolve(window.Stripe(STRIPE_PUBLIC_KEY));
            };
        });
    }
    return window.Stripe(STRIPE_PUBLIC_KEY);
};

/**
 * Crear sesión de checkout de Stripe
 */
export const createCheckoutSession = async (factura) => {
    try {
        const response = await fetch('http://localhost:3001/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                factura: factura,
                amount: Math.round(factura.total * 100), // Convertir a centavos
                currency: 'eur',
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const session = await response.json();
        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

/**
 * Procesar pago con Stripe
 */
export const processPaymentWithStripe = async (factura) => {
    try {
        const stripe = await initializeStripe();
        if (!stripe) {
            throw new Error('Stripe no se inicializó correctamente');
        }

        const session = await createCheckoutSession(factura);

        // Redirigir al checkout de Stripe
        const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (error) {
            console.error('Stripe error:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
};

export default {
    stripeConfig,
    initializeStripe,
    createCheckoutSession,
    processPaymentWithStripe,
};
