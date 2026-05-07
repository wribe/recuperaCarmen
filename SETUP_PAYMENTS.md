# Sistema de Pagos con Stripe - Guía de Configuración

## Descripción General

La aplicación ahora incluye un sistema completo de facturación y pagos con Stripe integrado. Permite crear facturas a partir de tareas completadas y procesar pagos.

## Nuevas Características

### 1. Campos de Facturación en Tareas
- **Horas**: Número de horas trabajadas
- **Precio/Hora**: Tarifa horaria
- **Total**: Se calcula automáticamente (Horas × Precio/Hora)

### 2. Gestión de Facturas
- Crear facturas a partir de tareas finalizadas
- Agrupar múltiples tareas en una factura
- Seleccionar método de pago (Efectivo, Transferencia, Tarjeta, Stripe)
- Visualizar detalles de facturas
- Imprimir facturas en PDF
- Procesar pagos con Stripe

### 3. Generación de Documentos
- Facturas en PDF con diseño profesional
- Listado de facturas exportable a PDF
- Información completa: cliente, fecha, tareas, totales

## Instalación

### Paso 1: Instalar dependencias
```bash
npm install
```

Nota: Stripe ya está incluido en las dependencias (`@stripe/stripe-js`).

### Paso 2: Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` y agrega tu clave pública de Stripe:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_your_actual_key_here
```

### Paso 3: Obtener claves de Stripe

1. Crea una cuenta en [https://stripe.com](https://stripe.com)
2. Accede a tu Dashboard
3. Ve a "Developers" → "API keys"
4. Copia tu clave pública (comienza con `pk_test_` o `pk_live_`)

## Configuración del Backend (Opcional)

Para procesar pagos reales con Stripe, necesitas configurar un backend que maneje:

1. **Endpoint POST `/create-checkout-session`**
   - Recibe: datos de la factura y monto
   - Crea una sesión de checkout de Stripe
   - Retorna: sessionId

Ejemplo básico en Node.js/Express:

```javascript
const stripe = require('stripe')('sk_test_your_secret_key');

app.post('/create-checkout-session', async (req, res) => {
    const { factura, amount, currency } = req.body;
    
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                name: factura.numeroFactura,
                description: `Factura para ${factura.cliente}`,
                amount: amount,
                currency: currency,
                quantity: 1,
            }],
            success_url: `${process.env.FRONTEND_URL}/facturas?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/facturas?canceled=true`,
        });
        
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## Uso de la Aplicación

### Crear una Tarea con Costo

1. Ve a la sección "Tareas"
2. Completa el formulario:
   - Título (obligatorio)
   - Fecha (obligatorio)
   - Empleado (opcional)
   - Horas (obligatorio, > 0)
   - Precio/Hora (obligatorio, > 0)
   - Estado (debe ser "finalizada" para facturar)
3. El Total se calcula automáticamente
4. Haz clic en "Grabar"

### Crear una Factura

1. Ve a la sección "Facturas"
2. Completa el formulario:
   - Cliente/Nombre: Nombre del cliente
   - Fecha de Factura: Fecha de emisión
   - Método de Pago: Selecciona el método
3. Selecciona las tareas finalizadas a incluir
4. El Total se calcula automáticamente
5. Haz clic en "Crear Factura"

### Imprimir Factura

1. En el listado de facturas, haz clic en el botón de impresora
2. Se abrirá una vista previa del PDF
3. Configura las opciones de impresión según necesites
4. Haz clic en "Imprimir" o "Guardar como PDF"

### Procesar Pago con Stripe

1. En el listado de facturas, busca una factura con método "Stripe"
2. Haz clic en el botón de tarjeta de crédito
3. Serás redirigido a Stripe Checkout
4. Completa el pago con tus datos de tarjeta

## Estructura de Datos

### Tarea
```javascript
{
    id: number,
    titulo: string,
    fecha: date,
    descripcion: string,
    estado: 'pendiente' | 'en_proceso' | 'finalizada',
    prioridad: 'baja' | 'media' | 'alta',
    empleadoId: number,
    horas: number,          // Nuevo
    precioHora: number,     // Nuevo
    total: number           // Nuevo (calculado)
}
```

### Factura
```javascript
{
    id: number,
    numeroFactura: string,
    cliente: string,
    fechaFactura: date,
    metodoPago: 'efectivo' | 'transferencia' | 'tarjeta' | 'stripe',
    tareas: Array<Tarea>,
    total: number,
    fechaCreacion: date
}
```

## Troubleshooting

### "Stripe no se inicializó correctamente"
- Verifica que VITE_STRIPE_PUBLIC_KEY esté configurado en `.env.local`
- Asegúrate de que tu clave pública es válida

### "Error al crear sesión de checkout"
- Verifica que el backend esté corriendo en el puerto 3001
- Asegúrate de que tu clave secreta de Stripe en el backend es válida
- Revisa la consola del navegador para más detalles

### Las facturas no se guardan
- Asegúrate de que el servidor JSON está corriendo: `npm run server`
- Verifica que el archivo `backend/data/db.json` existe

## Ejecutar la Aplicación

```bash
# Terminal 1: Backend (JSON Server)
npm run server

# Terminal 2: Frontend (Vite Dev Server)
npm run dev
```

Luego abre tu navegador en `http://localhost:5173`

## Seguridad

**IMPORTANTE**: Nunca guardes claves secretas de Stripe en el frontend o repositorio.

- Usa `.env.local` (agregado a `.gitignore`)
- Las claves secretas deben estar solo en el backend
- En producción, usa variables de entorno del servidor

## Notas

- Los pagos de prueba usan tarjetas de Stripe de prueba (ej: 4242 4242 4242 4242)
- En producción, cambia las claves de `pk_test_` y `sk_test_` a `pk_live_` y `sk_live_`
- Las facturas se almacenan en `backend/data/db.json`

## Soporte

Para más información sobre Stripe:
- Documentación: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Dashboard: https://dashboard.stripe.com
