<template>
    <div class="container-fluid mt-4 mb-5">
        <h1 class="text-center mb-4 text-primary fw-bold">Gestión de Facturas</h1>

        <!-- Formulario de creación de facturas -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">
                    <i class="bi bi-receipt me-2"></i>
                    Crear Nueva Factura
                </h6>
            </div>
            <div class="card-body">
                <form @submit.prevent="crearFactura">
                    <div class="row g-3">
                        <!-- Nombre/Cliente -->
                        <div class="col-md-6">
                            <label for="cliente" class="form-label fw-semibold">Cliente/Nombre: <span class="text-danger">*</span></label>
                            <input type="text" id="cliente" v-model="nuevaFactura.cliente"
                                class="form-control" :class="{ 'is-invalid': !clienteValido }"
                                placeholder="Nombre del cliente" />
                            <div v-if="!clienteValido" class="invalid-feedback">El cliente es obligatorio.</div>
                        </div>

                        <!-- Fecha de Factura -->
                        <div class="col-md-3">
                            <label for="fechaFactura" class="form-label fw-semibold">Fecha Factura: <span class="text-danger">*</span></label>
                            <input type="date" id="fechaFactura" v-model="nuevaFactura.fechaFactura"
                                class="form-control" :class="{ 'is-invalid': !fechaFacturaValida }" />
                            <div v-if="!fechaFacturaValida" class="invalid-feedback">La fecha es obligatoria.</div>
                        </div>

                        <!-- Método de Pago -->
                        <div class="col-md-3">
                            <label for="metodoPago" class="form-label fw-semibold">Método Pago: <span class="text-danger">*</span></label>
                            <select id="metodoPago" v-model="nuevaFactura.metodoPago"
                                class="form-select" :class="{ 'is-invalid': !metodoPagoValido }">
                                <option disabled value="">Seleccione</option>
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="stripe">Stripe</option>
                            </select>
                            <div v-if="!metodoPagoValido" class="invalid-feedback">El método de pago es obligatorio.</div>
                        </div>
                    </div>

                    <!-- Seleccionar Tareas -->
                    <div class="row g-3 mt-3">
                        <div class="col-12">
                            <label class="form-label fw-semibold">Seleccionar Tareas: <span class="text-danger">*</span></label>
                            <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                                <table class="table table-sm table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th><input type="checkbox" v-model="seleccionarTodas" /></th>
                                            <th>ID</th>
                                            <th>Título</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Empleado</th>
                                            <th>Horas</th>
                                            <th>Precio/H</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="tarea in tareasDisponibles" :key="tarea.id"
                                            :class="{ 'table-primary': tareasSeleccionadas.includes(tarea.id) }">
                                            <td>
                                                <input type="checkbox" 
                                                    :value="tarea.id"
                                                    v-model="tareasSeleccionadas" />
                                            </td>
                                            <td>{{ tarea.id }}</td>
                                            <td>{{ tarea.titulo }}</td>
                                            <td>{{ formatFecha(tarea.fecha) }}</td>
                                            <td>
                                                <span class="badge" :class="badgeEstado(tarea.estado)">
                                                    {{ tarea.estado }}
                                                </span>
                                            </td>
                                            <td>{{ obtenerNombreEmpleado(tarea.empleadoId) || '-' }}</td>
                                            <td>{{ tarea.horas }}</td>
                                            <td>{{ tarea.precioHora }}€</td>
                                            <td class="fw-bold">{{ tarea.total }}€</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-if="tareasDisponibles.length === 0" class="alert alert-info mt-3">
                                    No hay tareas disponibles para facturar.
                                </div>
                            </div>
                            <div v-if="tareasSeleccionadas.length === 0" class="alert alert-warning mt-2 mb-0">
                                Debe seleccionar al menos una tarea.
                            </div>
                        </div>
                    </div>

                    <!-- Total de Factura -->
                    <div class="row g-3 mt-3">
                        <div class="col-md-3 ms-auto">
                            <div class="card bg-light">
                                <div class="card-body">
                                    <h5 class="card-title">Total Factura</h5>
                                    <h3 class="text-primary fw-bold">{{ totalFactura }}€</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div class="d-flex justify-content-center gap-3 mt-4">
                        <button type="submit" class="btn btn-primary px-4">
                            <i class="bi bi-check-circle me-1"></i>
                            Crear Factura
                        </button>
                        <button type="button" class="btn btn-secondary px-4" @click="limpiarFormulario">
                            <i class="bi bi-x-circle me-1"></i>
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Listado de Facturas -->
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="bi bi-list-check me-2"></i>Listado de Facturas
                </h6>
                <button type="button" class="btn btn-light btn-sm" @click="exportarFacturasAPDF">
                    <i class="bi bi-file-pdf me-1"></i>Exportar PDF
                </button>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle mb-0">
                        <thead class="table-primary">
                            <tr>
                                <th class="text-center">Nº Factura</th>
                                <th class="text-center">Cliente</th>
                                <th class="text-center">Fecha</th>
                                <th class="text-center">Nº Tareas</th>
                                <th class="text-center">Total</th>
                                <th class="text-center">Método Pago</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="factura in facturas" :key="factura.id">
                                <td class="text-center fw-bold">{{ factura.numeroFactura }}</td>
                                <td class="text-center">{{ factura.cliente }}</td>
                                <td class="text-center">{{ formatFecha(factura.fechaFactura) }}</td>
                                <td class="text-center">{{ factura.tareas.length }}</td>
                                <td class="text-center fw-bold">{{ factura.total }}€</td>
                                <td class="text-center">
                                    <span class="badge" :class="badgeMetodoPago(factura.metodoPago)">
                                        {{ formatMetodoPago(factura.metodoPago) }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <button @click="verDetallesFactura(factura)" class="btn btn-info btn-sm me-1"
                                        title="Ver detalles">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                    <button @click="imprimirFactura(factura)" class="btn btn-warning btn-sm me-1"
                                        title="Imprimir">
                                        <i class="bi bi-printer"></i>
                                    </button>
                                    <button v-if="factura.metodoPago === 'stripe'" 
                                        @click="procesarPagoStripe(factura)" class="btn btn-danger btn-sm me-1"
                                        title="Pagar con Stripe">
                                        <i class="bi bi-credit-card"></i>
                                    </button>
                                    <button @click="eliminarFactura(factura.id)" class="btn btn-danger btn-sm"
                                        title="Eliminar">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="facturas.length === 0" class="alert alert-info m-3">
                    No hay facturas creadas aún.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getFacturas, addFactura, deleteFactura, generarNumeroFactura, calcularTotalFactura } from "../api/facturas.js";
import { getTareas } from "../api/tareas.js";
import { getEmpleados } from "../api/empleados.js";
import { processPaymentWithStripe } from "../api/stripe.js";

const tareas = ref([]);
const empleados = ref([]);
const facturas = ref([]);
const cargando = ref(false);

const nuevaFactura = reactive({
    cliente: "",
    fechaFactura: "",
    metodoPago: "",
    tareas: [],
});

const tareasSeleccionadas = ref([]);
const seleccionarTodas = ref(false);

const clienteValido = ref(true);
const fechaFacturaValida = ref(true);
const metodoPagoValido = ref(true);

// Tareas disponibles (todas las tareas)
const tareasDisponibles = computed(() => {
    return tareas.value;
});

// Total de la factura
const totalFactura = computed(() => {
    return tareasSeleccionadas.value.reduce((total, tareaId) => {
        const tarea = tareas.value.find(t => t.id === tareaId);
        return total + (tarea ? tarea.total : 0);
    }, 0);
});

// Watcher para seleccionar todas las tareas
const seleccionarTodasHandler = (value) => {
    if (value) {
        tareasSeleccionadas.value = tareasDisponibles.value.map(t => t.id);
    } else {
        tareasSeleccionadas.value = [];
    }
};

// ========================= CICLO DE VIDA =========================

onMounted(async () => {
    await cargarDatos();
});

const cargarDatos = async () => {
    try {
        cargando.value = true;
        tareas.value = await getTareas();
        empleados.value = await getEmpleados();
        facturas.value = await getFacturas();
        console.log("Datos cargados correctamente");
    } catch (error) {
        console.error("Error al cargar datos:", error);
        alerta("error", "Error", "No se pudieron cargar los datos");
    } finally {
        cargando.value = false;
    }
};

// ========================= MÉTODOS =========================

const obtenerNombreEmpleado = (empleadoId) => {
    if (!empleadoId) return null;
    const empleado = empleados.value.find(e => e.id === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellidos}` : null;
};

const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const [ano, mes, dia] = fecha.split("-");
    return `${dia}-${mes}-${ano}`;
};

const formatMetodoPago = (metodo) => {
    const nombres = {
        efectivo: "Efectivo",
        transferencia: "Transferencia",
        tarjeta: "Tarjeta",
        stripe: "Stripe"
    };
    return nombres[metodo] || metodo;
};

const badgeMetodoPago = (metodo) => {
    const colores = {
        efectivo: "bg-success",
        transferencia: "bg-info",
        tarjeta: "bg-warning text-dark",
        stripe: "bg-danger"
    };
    return colores[metodo] || "bg-secondary";
};

const badgeEstado = (estado) => {
    const colores = {
        pendiente: "bg-danger",
        en_proceso: "bg-warning text-dark",
        finalizada: "bg-success"
    };
    return colores[estado] || "bg-secondary";
};

const validarFormulario = () => {
    clienteValido.value = !!nuevaFactura.cliente.trim();
    fechaFacturaValida.value = !!nuevaFactura.fechaFactura;
    metodoPagoValido.value = !!nuevaFactura.metodoPago;

    if (!clienteValido.value) {
        alerta("error", "Error", "El cliente es obligatorio");
        return false;
    }
    if (!fechaFacturaValida.value) {
        alerta("error", "Error", "La fecha de factura es obligatoria");
        return false;
    }
    if (!metodoPagoValido.value) {
        alerta("error", "Error", "El método de pago es obligatorio");
        return false;
    }
    if (tareasSeleccionadas.value.length === 0) {
        alerta("error", "Error", "Debe seleccionar al menos una tarea");
        return false;
    }

    return true;
};

const crearFactura = async () => {
    if (!validarFormulario()) return;

    try {
        cargando.value = true;

        const tareasFactura = tareas.value.filter(t => tareasSeleccionadas.value.includes(t.id));
        const total = calcularTotalFactura(tareasFactura);

        const factura = {
            numeroFactura: generarNumeroFactura(),
            cliente: nuevaFactura.cliente.trim(),
            fechaFactura: nuevaFactura.fechaFactura,
            metodoPago: nuevaFactura.metodoPago,
            tareas: tareasFactura,
            total: total,
            fechaCreacion: new Date().toISOString(),
        };

        await addFactura(factura);
        await cargarDatos();
        limpiarFormulario();

        Swal.fire({
            icon: "success",
            title: "Factura creada",
            text: `Factura ${factura.numeroFactura} creada correctamente`,
            showConfirmButton: false,
            timer: 1500,
        });
    } catch (error) {
        console.error("Error al crear factura:", error);
        alerta("error", "Error", "No se pudo crear la factura");
    } finally {
        cargando.value = false;
    }
};

const limpiarFormulario = () => {
    nuevaFactura.cliente = "";
    nuevaFactura.fechaFactura = "";
    nuevaFactura.metodoPago = "";
    nuevaFactura.tareas = [];
    tareasSeleccionadas.value = [];
    seleccionarTodas.value = false;

    clienteValido.value = true;
    fechaFacturaValida.value = true;
    metodoPagoValido.value = true;
};

const verDetallesFactura = (factura) => {
    let detalles = `<div style="text-align: left;">
        <p><strong>Nº Factura:</strong> ${factura.numeroFactura}</p>
        <p><strong>Cliente:</strong> ${factura.cliente}</p>
        <p><strong>Fecha:</strong> ${formatFecha(factura.fechaFactura)}</p>
        <p><strong>Método Pago:</strong> ${formatMetodoPago(factura.metodoPago)}</p>
        <hr>
        <h5>Tareas Incluidas:</h5>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
                <th style="text-align: left; padding: 5px;">Tarea</th>
                <th style="text-align: center; padding: 5px;">Horas</th>
                <th style="text-align: center; padding: 5px;">Precio/H</th>
                <th style="text-align: center; padding: 5px;">Total</th>
            </tr>`;

    factura.tareas.forEach(t => {
        detalles += `<tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 5px;">${t.titulo}</td>
            <td style="text-align: center; padding: 5px;">${t.horas}</td>
            <td style="text-align: center; padding: 5px;">${t.precioHora}€</td>
            <td style="text-align: center; padding: 5px;">${t.total}€</td>
        </tr>`;
    });

    detalles += `</table>
        <hr>
        <p style="font-size: 18px; font-weight: bold; text-align: right;">
            Total: <span style="color: #0d6efd;">${factura.total}€</span>
        </p>
    </div>`;

    Swal.fire({
        title: "Detalles de Factura",
        html: detalles,
        icon: "info",
        confirmButtonText: "Cerrar"
    });
};

const imprimirFactura = (factura) => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("FACTURA", 15, 20);

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Nº: ${factura.numeroFactura}`, 15, 30);

    // Información principal
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Cliente: ${factura.cliente}`, 15, 55);
    doc.text(`Fecha: ${formatFecha(factura.fechaFactura)}`, 15, 65);
    doc.text(`Método de Pago: ${formatMetodoPago(factura.metodoPago)}`, 15, 75);

    // Tabla de tareas
    const columnas = ["Tarea", "Empleado", "Horas", "Precio/H", "Total"];
    const filas = factura.tareas.map(t => [
        t.titulo,
        obtenerNombreEmpleado(t.empleadoId) || '-',
        t.horas,
        `${t.precioHora}€`,
        `${t.total}€`
    ]);

    autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 85,
        theme: 'striped',
        headStyles: {
            fillColor: [13, 110, 253],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [51, 51, 51]
        },
        columnStyles: {
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center', fontStyle: 'bold' }
        }
    });

    // Total final
    const finalY = doc.internal.pageSize.height - 60;
    doc.setFontSize(12);
    doc.setTextColor(13, 110, 253);
    doc.text(`TOTAL: ${factura.total}€`, 15, finalY);

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 15, doc.internal.pageSize.height - 10);

    doc.save(`Factura_${factura.numeroFactura}.pdf`);
};

const eliminarFactura = async (id) => {
    const factura = facturas.value.find(f => f.id === id);
    if (!factura) return;

    const result = await Swal.fire({
        title: "¿Eliminar factura?",
        text: `Vas a eliminar la factura ${factura.numeroFactura}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
        cargando.value = true;
        await deleteFactura(id);
        await cargarDatos();

        Swal.fire({
            icon: "success",
            title: "Factura eliminada",
            showConfirmButton: false,
            timer: 1500,
        });
    } catch (error) {
        console.error("Error al eliminar factura:", error);
        alerta("error", "Error", "No se pudo eliminar la factura");
    } finally {
        cargando.value = false;
    }
};

const exportarFacturasAPDF = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("LISTADO DE FACTURAS", 15, 18);

    // Tabla
    const columnas = ["Nº Factura", "Cliente", "Fecha", "Nº Tareas", "Total", "Método"];
    const filas = facturas.value.map(f => [
        f.numeroFactura,
        f.cliente,
        formatFecha(f.fechaFactura),
        f.tareas.length,
        `${f.total}€`,
        formatMetodoPago(f.metodoPago)
    ]);

    autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 40,
        theme: 'striped',
        headStyles: {
            fillColor: [13, 110, 253],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
        },
        bodyStyles: {
            fontSize: 8,
            textColor: [51, 51, 51]
        }
    });

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 15, doc.internal.pageSize.height - 10);
    }

    doc.save("Listado_Facturas.pdf");
};

const procesarPagoStripe = async (factura) => {
    try {
        cargando.value = true;
        Swal.fire({
            title: "Procesando pago...",
            html: "Redirigiendo a Stripe...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        await processPaymentWithStripe(factura);
    } catch (error) {
        console.error("Error al procesar pago:", error);
        Swal.close();
        alerta("error", "Error en pago", 
            "No se pudo procesar el pago. Por favor, verifique que Stripe esté configurado correctamente en el backend.");
    } finally {
        cargando.value = false;
    }
};

function alerta(tipo, titulo, texto) {
    Swal.fire({
        icon: tipo,
        title: titulo,
        text: texto,
        showConfirmButton: tipo !== "success",
        timer: tipo === "success" ? 1500 : undefined,
    });
}

// Watchers
watch(() => seleccionarTodas.value, seleccionarTodasHandler);
</script>

<style scoped>
.card {
    border: none;
    border-radius: 0.75rem;
}

.card-header {
    border-radius: 0.75rem 0.75rem 0 0 !important;
}

.table th {
    font-weight: 600;
    font-size: 0.9rem;
}

.table td {
    font-size: 0.9rem;
}

.btn-sm {
    padding: 0.3rem 0.5rem;
}

.badge {
    font-size: 0.8rem;
    padding: 0.4em 0.7em;
}
</style>
