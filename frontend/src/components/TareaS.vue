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
                                class="form-control text-center" :class="{ 'is-invalid': !fechaValida }" />
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
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" id="prioridadBaja"
                                    v-model="nuevaTarea.prioridad" value="baja" />
                                <label class="form-check-label" for="prioridadBaja">
                                    <span class="badge  text-dark">Baja</span>
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" id="prioridadMedia"
                                    v-model="nuevaTarea.prioridad" value="media" />
                                <label class="form-check-label" for="prioridadMedia">
                                    <span class="badge  text-dark">Media</span>
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" id="prioridadAlta"
                                    v-model="nuevaTarea.prioridad" value="alta" />
                                <label class="form-check-label" for="prioridadAlta">
                                    <span class="badge  text-dark">Alta</span>
                                </label>
                            </div>
                        </div>

                        <!-- Empleado asignado (búsqueda por ID) — solo estético de momento -->
                        <div class="col-md-2">
                            <label for="empleadoId" class="form-label fw-semibold">Empleado (ID):</label>
                            <div class="input-group input-group-sm">
                                <input type="number" id="empleadoId"
                                    class="form-control"
                                    placeholder="ID" min="1" />
                                <button type="button" class="btn btn-outline-secondary" title="Buscar empleado">
                                    <i class="bi bi-search-heart"></i>
                                </button>
                            </div>
                        </div>

                    </div>

                    <!-- Botones -->
                    <div class="d-flex justify-content-center gap-3 mt-4">
                        <button type="submit" class="btn btn-primary px-4">
                            <i class="bi me-1"></i>
                            {{ editando ? "Modificar" : "Grabar" }}
                        </button>
                        <button v-if="editando" type="button" class="btn btn-secondary px-4" @click="cancelarEdicion">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>

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
                                <th class="text-center" scope="col">Título</th>
                                <th class="text-center" scope="col">Estado</th>
                                <th class="text-center" scope="col">Prioridad</th>
                                <th class="text-center" scope="col">Empleado</th>
                                <th class="text-center" scope="col" style="width: 140px">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tarea in tareas" :key="tarea.id">
                                <td class="text-center fw-bold">{{ tarea.id }}</td>
                                <td class="text-center">{{ formatFecha(tarea.fecha) }}</td>
                                <td class="text-center">{{ tarea.titulo }}</td>
                                <td class="text-center">
                                    <span class="badge" :class="badgeEstado(tarea.estado)">
                                        {{ formatEstado(tarea.estado) }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <span class="badge text-dark" >
                                        {{ formatPrioridad(tarea.prioridad) }}
                                    </span>
                                </td>
                                <td class="text-center">-</td>
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


const tareas = ref([]);



const nuevaTarea = reactive({
    titulo: "",
    fecha: "",
    descripcion: "",
    estado: "",
    prioridad: "baja",
});

const editando = ref(false);
const editandoId = ref(null);


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



const addTarea = async () => {
    if (!validarFormulario()) return;


    tareas.value.push({
        titulo: capitalizarPalabras(nuevaTarea.titulo.trim()),
        fecha: nuevaTarea.fecha,
        descripcion: nuevaTarea.descripcion.trim(),
        estado: nuevaTarea.estado,
        prioridad: nuevaTarea.prioridad,
    });

    limpiarFormulario();
    
    alerta("success", "Tarea añadida");
};


const selTarea = (id) => {
    const tarea = tareas.value.find((t) => t.id === id);
    if (!tarea) return;

    nuevaTarea.titulo = tarea.titulo;
    nuevaTarea.fecha = tarea.fecha;
    nuevaTarea.descripcion = tarea.descripcion;
    nuevaTarea.estado = tarea.estado;
    nuevaTarea.prioridad = tarea.prioridad;

    editando.value = true;
    editandoId.value = id;

    
    tituloValido.value = true;
    fechaValida.value = true;
    estadoValido.value = true;

};


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
    };

    limpiarFormulario();

    Swal.fire({
        icon: "success",
        title: "Tarea actualizada",
        showConfirmButton: false,
        timer: 1500,
    });
};


const delTarea = async (id) => {
    const tarea = tareas.value.find((t) => t.id === id);
    if (!tarea) {
        alerta("error", "Tarea no encontrada", "");
        return;
    }

    const result = await Swal.fire({
        title: `¿Eliminar la tarea ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
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


const cancelarEdicion = () => {
    limpiarFormulario();
};


const limpiarFormulario = () => {
    nuevaTarea.titulo = "";
    nuevaTarea.fecha = "";
    nuevaTarea.descripcion = "";
    nuevaTarea.estado = "";
    nuevaTarea.prioridad = "baja";

    editando.value = false;
    editandoId.value = null;

    tituloValido.value = true;
    fechaValida.value = true;
    estadoValido.value = true;
};


const capitalizarPalabras = (str) => {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};


const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const [ano, mes, dia] = fecha.split("-");
    return `${dia}-${mes}-${ano}`;
};

const formatEstado = (estado) => {
    const nombres = { pendiente: "Pendiente", en_proceso: "En proceso", finalizada: "Finalizada" };
    return nombres[estado] || "-";
};


const badgeEstado = (estado) => {
    const colores = { pendiente: "bg-danger", en_proceso: "bg-warning text-dark", finalizada: "bg-success" };
    return colores[estado] || "bg-secondary";
};

// Prioridad → texto
const formatPrioridad = (prioridad) => {
    const nombres = { baja: "Baja", media: "Media", alta: "Alta" };
    return nombres[prioridad] || "-";
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