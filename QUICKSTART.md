# 🚀 Guía de Inicio Rápido - Sistema de Facturación y Pagos

## Instalación Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Instalar dependencias del servidor Stripe (opcional)
```bash
npm install --save-dev express cors dotenv stripe
```

O usa el script:
```bash
bash install-stripe-deps.sh
```

### 3. Ejecutar la aplicación

**Terminal 1 - Backend (JSON Server):**
```bash
npm run server
```
Escucha en: `http://localhost:3000`

**Terminal 2 - Frontend (Vite):**
```bash
npm run dev
```
Accede en: `http://localhost:5173`

**Terminal 3 - Servidor Stripe (opcional):**
```bash
npm run stripe
```
Escucha en: `http://localhost:3001`

## 🎯 Uso de la Aplicación

### Crear una Tarea
1. Ve a **Tareas**
2. Completa:
   - Título (obligatorio)
   - Fecha (obligatorio)
   - Horas (obligatorio, > 0)
   - Precio/Hora (obligatorio, > 0)
   - Estado
3. El **Total** se calcula automáticamente
4. Haz clic en **Grabar**

### Crear una Factura
1. Ve a **Facturas**
2. Completa:
   - Cliente/Nombre
   - Fecha de Factura
   - Método de Pago (Efectivo, Transferencia, Tarjeta, Stripe)
3. Selecciona las tareas a incluir
4. Haz clic en **Crear Factura**

### Imprimir Factura
1. En el listado, haz clic en el botón **Impresora** (🖨️)
2. Se abrirá una vista previa en PDF
3. Configura opciones de impresión
4. Haz clic en **Imprimir** o **Guardar como PDF**

### Procesar Pago con Stripe (si está configurado)
1. Crea una factura con método **Stripe**
2. Haz clic en el botón **Tarjeta de Crédito** (💳)
3. Serás redirigido a Stripe Checkout
4. Completa el pago

## 💡 Notas

### Sin servidor Stripe
- La aplicación funciona perfectamente sin el servidor de Stripe
- Puedes crear facturas y imprimirlas en PDF
- Solo falla si intentas pagar con Stripe

### Con servidor Stripe
- **Modo simulación**: Funciona sin claves reales de Stripe
- **Modo real**: Necesitas claves de Stripe en `.env.server`

## 🔑 Configuración de Stripe (Opcional)

### Paso 1: Obtener claves
1. Crea cuenta en https://stripe.com
2. Ve a https://dashboard.stripe.com/apikeys
3. Copia tu **clave secreta** (sk_test_...)
4. Copia tu **clave pública** (pk_test_...)

### Paso 2: Configurar
Edita `.env.server`:
```env
STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_aqui
```

### Paso 3: Ejecutar servidor
```bash
npm run stripe
```

### Tarjetas de prueba
- **Válida**: 4242 4242 4242 4242
- **Rechazada**: 4000 0000 0000 0002
- **Expiración**: Cualquier fecha futura
- **CVC**: Cualquier número de 3 dígitos

## 📊 Estructura del Proyecto

```
recuperaCarmen/
├── backend/
│   ├── data/
│   │   └── db.json           # Base de datos
│   ├── stripe-server.js      # Servidor Stripe
│   └── stripe-server-example.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── TareaS.vue     # Gestión de tareas
│       │   ├── FactuRas.vue   # Gestión de facturas
│       │   └── ...
│       ├── api/
│       │   ├── tareas.js
│       │   ├── facturas.js
│       │   └── stripe.js
│       └── router/
│           └── index.js
├── .env.server               # Config Stripe
├── package.json
└── README.md
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
Ejecuta:
```bash
npm install --save-dev express cors dotenv stripe
```

### Error: "Port 3001 already in use"
- Cambia el puerto en `.env.server`: `PORT=3002`
- O mata el proceso: `lsof -ti:3001 | xargs kill -9`

### Error: "Failed to fetch from localhost:3001"
- Asegúrate de ejecutar: `npm run stripe`
- Verifica que el puerto 3001 esté disponible

### Facturas no se guardan
- Asegúrate de que el JSON Server está corriendo: `npm run server`
- Verifica que `backend/data/db.json` existe

## 📚 Documentación Completa

Ver [SETUP_PAYMENTS.md](SETUP_PAYMENTS.md) para documentación detallada.

## 🎓 Ejemplo Completo

```bash
# Terminal 1
npm run server

# Terminal 2
npm run dev

# Terminal 3 (opcional para pagos)
npm run stripe
```

Luego abre `http://localhost:5173` en tu navegador.

---

¿Preguntas? Revisa SETUP_PAYMENTS.md o los comentarios en el código.
