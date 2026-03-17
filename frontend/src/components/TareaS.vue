<template>
    <div class="container-fluid mt-4 mb-5">
        <h1 class="text-center mb-4 text-primary fw-bold">Gestión de Tareas</h1>

        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">
                    <i class="bi bi-clipboard-plus me-2"></i>
                    {{ editando ? "Editar Tarea" : "Añadir Tarea" }}
                </h6>
            </div>
            <div class="card-body">
                <form @submit.prevent="editando ? updateTarea() : addTarea()">
                    <div class="row g-3">

                        <!-- Título -->
                        <div class="col-md-6">
                            <label for="titulo" class="form-label fw-semibold">Título: <span class="text-danger">*</span></label>
                            <input type="text" id="titulo" v-model="nuevaTarea.titulo"
                                class="form-control" :class="{ 'is-invalid': !tituloValido }"
                                placeholder="Título de la tarea" />
                            <div v-if="!tituloValido" class="invalid-feedback">El título es obligatorio.</div>
                        </div>

                        <!-- Fecha -->
                        <div class="col-md-3">
                            <label for="fecha" class="form-label fw-semibold">Fecha: <span class="text-danger">*</span></label>
                            <input type="date" id="fecha" v-model="nuevaTarea.fecha"
                                class="form-control" :class="{ 'is-invalid': !fechaValida }" />
                            <div v-if="!fechaValida" class="invalid-feedback">La fecha es obligatoria.</div>
                        </div>

                        <!-- Estado (select) -->
                        <div class="col-md-3">
                            <label for="estado" class="form-label fw-semibold">Estado: <span class="text-danger">*</span></label>
                            <select id="estado" v-model="nuevaTarea.estado"
                                class="form-select" :class="{ 'is-invalid': !estadoValido }">
                                <option disabled value="">Seleccione estado</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="en_proceso">En proceso</option>
                                <option value="finalizada">Finalizada</option>
                            </select>
                            <div v-if="!estadoValido" class="invalid-feedback">El estado es obligatorio.</div>
                        </div>

                        <!-- Descripción (textarea) -->
                        <div class="col-md-6">
                            <label for="descripcion" class="form-label fw-semibold">Descripción:</label>
                            <textarea id="descripcion" v-model="nuevaTarea.descripcion"
                                class="form-control" rows="3" placeholder="Descripción de la tarea"></textarea>
                        </div>

                        <!-- Prioridad (radiobutton) -->
                        <div class="col-md-3">
                            <label class="form-label fw-semibold d-block">Prioridad:</label>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="prioridadBaja"
                                    v-model="nuevaTarea.prioridad" value="baja" />
                                <label class="form-check-label" for="prioridadBaja">
                                    <span class="badge bg-info text-dark">Baja</span>
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="prioridadMedia"
                                    v-model="nuevaTarea.prioridad" value="media" />
                                <label class="form-check-label" for="prioridadMedia">
                                    <span class="badge bg-warning text-dark">Media</span>
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="prioridadAlta"
                                    v-model="nuevaTarea.prioridad" value="alta" />
                                <label class="form-check-label" for="prioridadAlta">
                                    <span class="badge bg-danger">Alta</span>
                                </label>
                            </div>
                        </div>

                        <!-- Empleado asignado (búsqueda por ID) -->
                        <div class="col-md-3">
                            <label for="empleadoId" class="form-label fw-semibold">Empleado (ID):</label>
                            <div class="input-group">
                                <input type="number" id="empleadoId" v-model.number="nuevaTarea.empleadoId"
                                    class="form-control" :class="claseCampoEmpleado"
                                    placeholder="ID" min="1" />
                                <button type="button" class="btn btn-outline-secondary" @click="buscarEmpleado" title="Buscar empleado">
                                    🔎
                                </button>
                            </div>
                            <small v-if="empleadoEncontrado" class="text-primary fw-semibold">
                                <i class="bi bi-check-circle me-1"></i>{{ nombreEmpleadoEncontrado }}
                            </small>
                        </div>

                    </div>

                    <!-- Botones -->
                    <div class="d-flex justify-content-center gap-3 mt-4">
                        <button type="submit" class="btn btn-primary px-4">
                            <i class="bi me-1"></i>
                            {{ editando ? "Modificar" : "Añadir" }}
                        </button>
                        <button v-if="editando" type="button" class="btn btn-secondary px-4" @click="cancelarEdicion">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ========================= LISTADO DE TAREAS ========================= -->
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="bi bi-list-task me-2"></i>Listado de Tareas
                </h6>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle mb-0">
                        <thead class="table-primary">
                            <tr>
                                <th class="text-center" scope="col">ID</th>
                                <th class="text-center" scope="col">Fecha</th>
                                <th scope="col">Título</th>
                                <th scope="col">Descripción</th>
                                <th class="text-center" scope="col">Estado</th>
                                <th class="text-center" scope="col">Prioridad</th>
                                <th class="text-center" scope="col">Empleado</th>
                                <th class="text-center" scope="col" style="width: 140px">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tarea in tareas" :key="tarea.id">
                                <td class="text-center fw-bold">{{ tarea.id }}</td>
                                <td class="text-center">{{ tarea.fecha }}</td>
                                <td>{{ tarea.titulo }}</td>
                                <td>{{ tarea.descripcion || '-' }}</td>
                                <td class="text-center">
                                    <span class="badge" :class="badgeEstado(tarea.estado)">
                                        {{ formatEstado(tarea.estado) }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <span class="badge" :class="badgePrioridad(tarea.prioridad)">
                                        {{ formatPrioridad(tarea.prioridad) }}
                                    </span>
                                </td>
                                <td class="text-center">{{ obtenerNombreEmpleado(tarea.empleadoId) }}</td>
                                <td class="text-center">
                                    <button @click="selTarea(tarea.id)" class="btn btn-warning btn-sm me-1"
                                        title="Cargar en formulario">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button @click="delTarea(tarea.id)" class="btn btn-danger btn-sm"
                                        title="Eliminar tarea">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Swal from "sweetalert2";

// ========================= DATOS TAREAS (ARRAY LOCAL) =========================

const tareas = ref([]);

let siguienteId = 1;

// Modelo del formulario
const nuevaTarea = reactive({
    titulo: "",
    fecha: "",
    descripcion: "",
    estado: "",
    prioridad: "baja",
    empleadoId: null,
});

// Estado de edición
const editando = ref(false);
const editandoId = ref(null);

// ========================= VALIDACIONES =========================

const tituloValido = ref(true);
const fechaValida = ref(true);
const estadoValido = ref(true);

const validarFormulario = () => {
    tituloValido.value = !!nuevaTarea.titulo.trim();
    fechaValida.value = !!nuevaTarea.fecha;
    estadoValido.value = !!nuevaTarea.estado;

    if (!tituloValido.value) {
        alerta("error", "Error", "El título es obligatorio");
        return false;
    }
    if (!fechaValida.value) {
        alerta("error", "Error", "La fecha es obligatoria");
        return false;
    }
    if (!estadoValido.value) {
        alerta("error", "Error", "El estado es obligatorio");
        return false;
    }
    return true;
};

// ========================= BÚSQUEDA DE EMPLEADO =========================

const empleadoEncontrado = ref(false);
const empleadoBuscado = ref(false); // true cuando ya se hizo una búsqueda
const nombreEmpleadoEncontrado = ref("");

const claseCampoEmpleado = ref("");

const buscarEmpleado = () => {
    // TODO: Implementar búsqueda real de empleado cuando se conecte con el backend
    // const id = nuevaTarea.empleadoId;
    // if (!id) {
    //     empleadoEncontrado.value = false;
    //     empleadoBuscado.value = false;
    //     claseCampoEmpleado.value = "";
    //     nombreEmpleadoEncontrado.value = "";
    //     return;
    // }
    // const emp = empleados.value.find((e) => e.id === id);
    // if (emp) {
    //     empleadoEncontrado.value = true;
    //     empleadoBuscado.value = true;
    //     nombreEmpleadoEncontrado.value = `${emp.nombre} ${emp.apellidos}`;
    //     claseCampoEmpleado.value = "border-warning bg-warning bg-opacity-25";
    //     alerta("success", "Empleado encontrado", nombreEmpleadoEncontrado.value);
    // } else {
    //     empleadoEncontrado.value = false;
    //     empleadoBuscado.value = true;
    //     nombreEmpleadoEncontrado.value = "";
    //     claseCampoEmpleado.value = "border-danger bg-danger bg-opacity-10";
    //     alerta("error", "No encontrado", `No existe ningún empleado con ID ${id}`);
    //     nuevaTarea.empleadoId = null;
    // }
};

// ========================= FUNCIONES CRUD =========================

// addTarea
const addTarea = async () => {
    if (!validarFormulario()) return;


    tareas.value.push({
        id: siguienteId++,
        titulo: nuevaTarea.titulo.trim(),
        fecha: nuevaTarea.fecha,
        descripcion: nuevaTarea.descripcion.trim(),
        estado: nuevaTarea.estado,
        prioridad: nuevaTarea.prioridad,
        empleadoId: nuevaTarea.empleadoId,
    });

    limpiarFormulario();
    
    alerta("success", "Tarea añadida");
    /*Swal.fire({
        icon: "success",
        title: "Tarea añadida",
        showConfirmButton: false,
        timer: 1500,
    });*/
};

// selTarea
const selTarea = (id) => {
    const tarea = tareas.value.find((t) => t.id === id);
    if (!tarea) return;

    nuevaTarea.titulo = tarea.titulo;
    nuevaTarea.fecha = tarea.fecha;
    nuevaTarea.descripcion = tarea.descripcion;
    nuevaTarea.estado = tarea.estado;
    nuevaTarea.prioridad = tarea.prioridad;
    nuevaTarea.empleadoId = tarea.empleadoId;

    editando.value = true;
    editandoId.value = id;

    // Resetear validaciones
    tituloValido.value = true;
    fechaValida.value = true;
    estadoValido.value = true;

    // TODO: Implementar búsqueda de empleado cuando se conecte con el backend
    // if (tarea.empleadoId) {
    //     const emp = empleados.value.find((e) => e.id === tarea.empleadoId);
    //     if (emp) {
    //         empleadoEncontrado.value = true;
    //         empleadoBuscado.value = true;
    //         nombreEmpleadoEncontrado.value = `${emp.nombre} ${emp.apellidos}`;
    //         claseCampoEmpleado.value = "border-warning bg-warning bg-opacity-25";
    //     }
    // }

    window.scrollTo({ top: 0, behavior: "smooth" });
};

// updateTarea
const updateTarea = () => {
    if (!validarFormulario()) return;

    const index = tareas.value.findIndex((t) => t.id === editandoId.value);
    if (index === -1) return;

    tareas.value[index] = {
        id: editandoId.value,
        titulo: nuevaTarea.titulo.trim(),
        fecha: nuevaTarea.fecha,
        descripcion: nuevaTarea.descripcion.trim(),
        estado: nuevaTarea.estado,
        prioridad: nuevaTarea.prioridad,
        empleadoId: nuevaTarea.empleadoId,
    };

    limpiarFormulario();

    Swal.fire({
        icon: "success",
        title: "Tarea actualizada",
        showConfirmButton: false,
        timer: 1500,
    });
};

// delTarea
const delTarea = async (id) => {
    const tarea = tareas.value.find((t) => t.id === id);
    if (!tarea) {
        alerta("error", "Tarea no encontrada", "");
        return;
    }

    const result = await Swal.fire({
        title: `¿Eliminar la tarea "${tarea.titulo}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    tareas.value = tareas.value.filter((t) => t.id !== id);

    if (editandoId.value === id) {
        limpiarFormulario();
    }

    Swal.fire({
        icon: "success",
        title: "Tarea eliminada",
        showConfirmButton: false,
        timer: 1500,
    });
};

// Cancelar edición
const cancelarEdicion = () => {
    limpiarFormulario();
};

// Limpiar formulario
const limpiarFormulario = () => {
    nuevaTarea.titulo = "";
    nuevaTarea.fecha = "";
    nuevaTarea.descripcion = "";
    nuevaTarea.estado = "";
    nuevaTarea.prioridad = "baja";
    nuevaTarea.empleadoId = null;

    editando.value = false;
    editandoId.value = null;

    tituloValido.value = true;
    fechaValida.value = true;
    estadoValido.value = true;

    empleadoEncontrado.value = false;
    empleadoBuscado.value = false;
    nombreEmpleadoEncontrado.value = "";
    claseCampoEmpleado.value = "";
};

// ========================= HELPERS DE PRESENTACIÓN =========================

// Obtener nombre del empleado por su ID
// TODO: Implementar cuando se conecte con el backend
const obtenerNombreEmpleado = (empleadoId) => {
    if (!empleadoId) return "-";
    // const emp = empleados.value.find((e) => e.id === empleadoId);
    // return emp ? `${emp.nombre} ${emp.apellidos}` : "Desconocido";
    return `Empleado #${empleadoId}`;
};

// Estado → texto
const formatEstado = (estado) => {
    const nombres = { pendiente: "Pendiente", en_proceso: "En proceso", finalizada: "Finalizada" };
    return nombres[estado] || "-";
};

// Estado → color badge (rojo pendiente, amarillo en_proceso, verde finalizada)
const badgeEstado = (estado) => {
    const colores = { pendiente: "bg-danger", en_proceso: "bg-warning text-dark", finalizada: "bg-success" };
    return colores[estado] || "bg-secondary";
};

// Prioridad → texto
const formatPrioridad = (prioridad) => {
    const nombres = { baja: "Baja", media: "Media", alta: "Alta" };
    return nombres[prioridad] || "-";
};

// Prioridad → color badge
const badgePrioridad = (prioridad) => {
    const colores = { baja: "bg-info text-dark", media: "bg-warning text-dark", alta: "bg-danger" };
    return colores[prioridad] || "bg-secondary";
};

// Alerta genérica con Swal
function alerta(tipo, titulo, texto) {
    Swal.fire({
        icon: tipo,
        title: titulo,
        text: texto,
        showConfirmButton: tipo !== "success",
        timer: tipo === "success" ? 1500 : undefined,
    });
}
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