<template>
    <div class="container mt-4 mb-5">
        <h1 class="text-center mb-4 text-primary fw-bold">Gestión de Empleados</h1>

        <!-- Formulario -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">
                    <i class="bi bi-person-plus-fill me-2"></i>
                    {{ editando ? "Editar Empleado" : "Añadir Empleado" }}
                </h6>
            </div>
            <div class="card-body">
                <form @submit.prevent="editando ? updateEmpleado() : addEmpleado()">
                    <div class="row g-3">
                        <!-- Nombre -->
                        <div class="col-md-6">
                            <label for="nombre" class="form-label fw-semibold">Nombre: <span
                                    class="text-danger">*</span></label>
                            <input type="text" id="nombre" v-model="nuevoEmpleado.nombre" class="form-control"
                                :class="{ 'is-invalid': errores.nombre }" placeholder="Introduce el nombre" />
                            <div v-if="errores.nombre" class="invalid-feedback">{{ errores.nombre }}</div>
                        </div>

                        <!-- Apellidos -->
                        <div class="col-md-6">
                            <label for="apellidos" class="form-label fw-semibold">Apellidos:</label>
                            <input type="text" id="apellidos" v-model="nuevoEmpleado.apellidos" class="form-control"
                                placeholder="Introduce los apellidos" />
                        </div>

                        <!-- Email -->
                        <div class="col-md-6">
                            <label for="email" class="form-label fw-semibold">Email: <span
                                    class="text-danger">*</span></label>
                            <input type="email" id="email" v-model="nuevoEmpleado.email" class="form-control"
                                :class="{ 'is-invalid': errores.email }" placeholder="ejemplo@correo.com" />
                            <div v-if="errores.email" class="invalid-feedback">{{ errores.email }}</div>
                        </div>

                        <!-- Móvil -->
                        <div class="col-md-3">
                            <label for="movil" class="form-label fw-semibold">Móvil:</label>
                            <input type="tel" id="movil" v-model="nuevoEmpleado.movil" @blur="validarMovil"
                                class="form-control align-middle text-center" :class="{ 'is-invalid': !movilValido }" placeholder="612345678" />
                        </div>

                        <!-- Puesto (combobox) -->
                        <div class="col-md-3">
                            <label for="puesto" class="form-label fw-semibold">Puesto:</label>
                            <select id="puesto" v-model="nuevoEmpleado.puesto" class="form-select">
                                <option disabled value="">Seleccione puesto</option>
                                <option value="rrhh">RRHH</option>
                                <option value="contabilidad">Contabilidad</option>
                                <option value="almacen">Almacén</option>
                                <option value="ventas">Ventas</option>
                            </select>
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

        <!-- Listado de Empleados -->
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="bi bi-people-fill me-2"></i>Listado de Empleados
                </h6>
            </div>
            <div class="card-body p-0">
                <!-- Tabla responsive -->
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle mb-0">
                        <thead class="table-primary">
                            <tr>
                                <th class="text-center" scope="col">ID</th>
                                <th scope="col">Apellidos</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Email</th>
                                <th class="text-center" scope="col">Móvil</th>
                                <th class="text-center" scope="col">Puesto</th>
                                <th class="text-center" scope="col" style="width: 140px">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="empleado in getEmpleado()" :key="empleado.id">
                                <td class="text-center fw-bold">{{ empleado.id }}</td>
                                <td>{{ empleado.apellidos }}</td>
                                <td>{{ empleado.nombre }}</td>
                                <td>{{ empleado.email }}</td>
                                <td class="text-center">{{ empleado.movil || '-' }}</td>
                                <td class="text-center">
                                    <span class="badge" :class="badgePuesto(empleado.puesto)">
                                        {{ formatPuesto(empleado.puesto) }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <button @click="selEmpleado(empleado.id)" class="btn btn-warning btn-sm me-1"
                                        title="Cargar en formulario" aria-label="Editar empleado">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button @click="delEmpleado(empleado.id)" class="btn btn-danger btn-sm"
                                        title="Eliminar empleado">
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

// ========================= DATOS (ARRAY LOCAL) =========================

const empleados = ref([
    { id: 1, apellidos: "García López", nombre: "Ana", email: "ana@empresa.com", movil: "612345678", puesto: "rrhh" },
    { id: 2, apellidos: "Martínez Ruiz", nombre: "Carlos", email: "carlos@empresa.com", movil: "698765432", puesto: "contabilidad" },
    { id: 3, apellidos: "Fernández Díaz", nombre: "Laura", email: "laura@empresa.com", movil: "654321987", puesto: "ventas" },
]);

// Contador autoincremental de IDs
let siguienteId = 4;

// Modelo del formulario con v-model
const nuevoEmpleado = reactive({
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    puesto: "",
});

// Estado de edición
const editando = ref(false);
const editandoId = ref(null);

// Errores de validación
const errores = reactive({
    nombre: "",
    email: "",
});

// ========================= FUNCIONES CRUD =========================

// getEmpleado: devuelve todos los empleados del array
const getEmpleado = () => {
    return empleados.value;
};

// Validación básica: nombre y email obligatorios
const validarFormulario = () => {
    let valido = true;
    errores.nombre = "";
    errores.email = "";

    if (!nuevoEmpleado.nombre.trim()) {
        errores.nombre = "El nombre es obligatorio.";
        valido = false;
    }

    if (!nuevoEmpleado.email.trim()) {
        errores.email = "El email es obligatorio.";
        valido = false;
    } else {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(nuevoEmpleado.email.trim())) {
            errores.email = "El formato del email no es válido.";
            valido = false;
        }
    }

    return valido;
};

// Capitalizar cada palabra de un texto
const capitalizarPalabras = (str) => {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// addEmpleado: añade un nuevo empleado al array
const addEmpleado = async () => {
    if (!validarFormulario()) return;

    // Confirmación antes de añadir
    const result = await Swal.fire({
        title: '¿Desea añadir este empleado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, añadir',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    empleados.value.push({
        id: siguienteId++,
        nombre: capitalizarPalabras(nuevoEmpleado.nombre.trim()),
        apellidos: capitalizarPalabras(nuevoEmpleado.apellidos.trim()),
        email: nuevoEmpleado.email.trim(),
        movil: nuevoEmpleado.movil.trim(),
        puesto: nuevoEmpleado.puesto,
    });

    limpiarFormulario();

    Swal.fire({
        icon: 'success',
        title: 'Empleado añadido',
        showConfirmButton: false,
        timer: 1500
    });
};

// selEmpleado: carga los datos del empleado seleccionado en el formulario
const selEmpleado = (id) => {
    const empleado = empleados.value.find((e) => e.id === id);
    if (!empleado) return;

    nuevoEmpleado.nombre = empleado.nombre;
    nuevoEmpleado.apellidos = empleado.apellidos;
    nuevoEmpleado.email = empleado.email;
    nuevoEmpleado.movil = empleado.movil;
    nuevoEmpleado.puesto = empleado.puesto;

    editando.value = true;
    editandoId.value = id;

    errores.nombre = "";
    errores.email = "";

    // Scroll arriba al formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// updateEmpleado: modifica el empleado que se está editando
const updateEmpleado = () => {
    if (!validarFormulario()) return;

    const index = empleados.value.findIndex((e) => e.id === editandoId.value);
    if (index === -1) return;

    empleados.value[index] = {
        id: editandoId.value,
        nombre: nuevoEmpleado.nombre.trim(),
        apellidos: nuevoEmpleado.apellidos.trim(),
        email: nuevoEmpleado.email.trim(),
        movil: nuevoEmpleado.movil.trim(),
        puesto: nuevoEmpleado.puesto,
    };

    limpiarFormulario();
};

// delEmpleado: elimina un empleado del array por su id
const delEmpleado = async (id) => {
    // Buscar empleado por ID
    const empleadoAEliminar = empleados.value.find((e) => e.id === id);

    if (!empleadoAEliminar) {
        Swal.fire({
            icon: 'error',
            title: 'Empleado no encontrado',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    // Pedir confirmación antes de eliminar
    const result = await Swal.fire({
        title: `¿Eliminar al empleado ${empleadoAEliminar.nombre} ${empleadoAEliminar.apellidos}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    // Si no confirma, salir
    if (!result.isConfirmed) return;

    // Eliminar del array
    empleados.value = empleados.value.filter((e) => e.id !== id);

    // Si se elimina el que se estaba editando, cancelar edición
    if (editandoId.value === id) {
        limpiarFormulario();
    }

    Swal.fire({
        icon: 'success',
        title: 'Empleado eliminado',
        showConfirmButton: false,
        timer: 1500
    });
};

// Cancelar edición
const cancelarEdicion = () => {
    limpiarFormulario();
};

// Limpiar formulario y resetear estado
const limpiarFormulario = () => {
    nuevoEmpleado.nombre = "";
    nuevoEmpleado.apellidos = "";
    nuevoEmpleado.email = "";
    nuevoEmpleado.movil = "";
    nuevoEmpleado.puesto = "";

    editando.value = false;
    editandoId.value = null;
    errores.nombre = "";
    errores.email = "";
};

// Validar móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
    const movil = nuevoEmpleado.movil.trim();

    if (movil === "") {
        movilValido.value = true; // Vacío = válido (opcional)
        return true;
    }

    if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
        movilValido.value = movilRegex.test(movil);
        return movilValido.value;
    } else {
        movilValido.value = false;
        return false;
    }
};

// ========================= HELPERS DE PRESENTACIÓN =========================

// Formatear nombre del puesto para mostrar en la tabla
const formatPuesto = (puesto) => {
    const nombres = {
        rrhh: "RRHH",
        contabilidad: "Contabilidad",
        almacen: "Almacén",
        ventas: "Ventas",
    };
    return nombres[puesto] || "-";
};

// Color del badge según el puesto
const badgePuesto = (puesto) => {
    const colores = {
        rrhh: "bg-success",
        contabilidad: "bg-info text-dark",
        almacen: "bg-warning text-dark",
        ventas: "bg-primary",
    };
    return colores[puesto] || "bg-secondary";
};
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
