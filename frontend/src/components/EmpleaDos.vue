<template>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Bienvenido a Empleados</h1>
        <p class="lead text-center">Esta es la página de información de nuestro sistema de gestión de tareas.</p>
    </div>

    <div class="mx-auto mt-2 p-3 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light">
        <h3 class="text-center my-2">Registro de Empleados</h3>
        <!-- Formulario -->
        <form @submit.prevent="guardarEmpleado" class="mb-4">
            <!-- DNI con validación visual -->
            <div class="mb-3 row align-items-center">
                <!-- Columna DNI -->
                <div class="col-md-4 d-flex align-items-center">
                    <label for="dni" class="form-label mb-0 w-25 me-5">DNI: </label>
                    <div class="flex-grow-1 d-flex align-items-center">
                        <input type="text" id="dni" v-model="nuevoEmpleado.dni" @blur="validarDni"
                            class="form-control w-auto w-25 text-center ms-4" :class="[
                                { 'is-invalid': !dniValido },
                                { 'readonly-input': editando },
                            ]" :readonly="editando" required
                            oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
                            oninput="this.setCustomValidity('')" />
                        <button type="button" class="btn btn btn-primary ms-3 border-0 shadow-none rounded-0"
                            @click="buscarEmpleadoPorDNI(nuevoEmpleado.dni)" :disabled="editando"
                            :aria-disabled="String(editando)" title="Buscar por DNI">
                            <i class="bi bi-search"></i>
                        </button>

                        <div v-if="!dniValido" class="invalid-feedback">
                            DNI o NIE inválido.
                        </div>
                    </div>
                </div>
                <!-- RadioButtons -->
                <div class="col-md-3 d-flex align-items-center me-5">
                    <label for="tipoEmpleado" class="form-label me-4 ms-5 mb-0 text-nowrap">Tipo Empleado:</label>
                    <input type="radio" name="tipoEmpleado" id="tipoEmpleadoParticular" value="particular" class="me-1"
                        v-model="nuevoEmpleado.tipoEmpleado" checked required />
                    <label class="me-4">Particular</label>
                    <input type="radio" name="tipoEmpleado" id="tipoEmpleadoEmpresa" value="empresa" class="me-1"
                        v-model="nuevoEmpleado.tipoEmpleado" required />
                    <label>Empresa</label>
                </div>

                <!-- Columna Fecha de Alta a la derecha -->
                <div class="col-md-4 ms-auto d-flex align-items-center">
                    <label for="fecha_alta" class="form-label me-2 mb-0 text-nowrap">Fecha de Alta:</label>
                    <input type="date" id="fecha_alta" v-model="nuevoEmpleado.fecha_alta" class="form-control w-auto"
                        required oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
                        oninput="this.setCustomValidity('')" />

                    <!-- Botón recargar -->
                    <div class="col-md-1 ms-auto d-flex align-items-center me-3">
                        <button type="button" class="btn btn btn-primary me-4 border-0 shadow-none rounded-0"
                            @click="refrescarPagina" title="Refrescar Página">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Nombre y Apellidos -->
            <div class="mb-3 row g-3 align-items-center">
                <!-- Nombre -->
                <div class="col-md-5 d-flex align-items-center">
                    <label for="nombre" class="form-label mb-0 text-nowrap w-25">Nombre:</label>
                    <input type="text" id="nombre" v-model="nuevoEmpleado.nombre" class="form-control flex-grow-1"
                        @blur="capitalizarTexto('nombre')" required />
                </div>

                <!-- Apellidos -->
                <div class="col-md-4 d-flex align-items-center ms-5">
                    <label for="apellidos" class="form-label me-4 mb-0 text-nowrap">Apellidos:</label>
                    <input type="text" id="apellidos" v-model="nuevoEmpleado.apellidos" class="form-control flex-grow-1"
                        @blur="capitalizarTexto('apellidos')" required />
                </div>
            </div>

            <!-- Email y Móvil -->
            <div class="mb-3 row g-3 align-items-center">
                <!-- Email -->
                <div class="col-md-5 d-flex align-items-center">
                    <label for="email" class="form-label mb-0 text-nowrap w-25">Email:</label>
                    <input type="email" id="email" v-model="nuevoEmpleado.email" class="form-control flex-grow-1"
                        @blur="validarEmail" :class="{ 'is-invalid': !emailValido }" required />
                </div>

                <!-- Móvil -->
                <div class="col-md-3 d-flex align-items-center">
                    <label for="movil" class="form-label me-4 ms-5 mb-0 text-nowrap">Móvil:</label>
                    <input type="tel" id="movil" v-model="nuevoEmpleado.movil" @blur="validarMovil"
                        class="form-control flex-grow-1 text-center" :class="{ 'is-invalid': !movilValido }" />
                </div>
            </div>

            <!-- Dirección, Provincia y Municipio -->
            <div class="mb-3 row g-3 align-items-center">
                <!-- Dirección -->
                <div class="col-md-5 d-flex align-items-center">
                    <label for="direccion" class="form-label mb-0 w-25 text-nowrap">Dirección:</label>
                    <input type="text" id="direccion" v-model="nuevoEmpleado.direccion"
                        class="form-control flex-grow-1" />
                </div>

                <!-- Provincia -->
                <div class="col-md-3 d-flex align-items-center">
                    <label for="provincia" class="form-label me-2 ms-5 mb-0 text-nowrap">Provincia:</label>
                    <select id="provincia" v-model="nuevoEmpleado.provincia" class="form-select flex-grow-1 w-25"
                        @change="filtrarMunicipios">
                        <option disabled value="">Seleccione provincia</option>
                        <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
                            {{ prov.nm }}
                        </option>
                    </select>
                </div>

                <!-- Municipio -->
                <div class="col-md-3 d-flex align-items-center">
                    <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap">Municipio:</label>
                    <select id="municipio" v-model="nuevoEmpleado.municipio" class="form-select flex-grow-1 w-auto">
                        <option disabled value="">Seleccione municipio</option>
                        <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">
                            {{ mun.nm }}
                        </option>
                    </select>
                </div>
            </div>
            <!-- Contraseña y Repetir Contraseña -->
            <div class="mb-3 row g-3 align-items-center justify-content-center">
                <div class="col-md-4 d-flex align-items-center">
                    <label for="password" class="form-label mb-0 text-nowrap flex-shrink-0 me-2">Contraseña:</label>
                    <input type="password" id="password" v-model="nuevoEmpleado.password"
                        class="form-control flex-grow-1" :required="!editando" autocomplete="new-password" />
                </div>
                <div class="col-md-4 d-flex align-items-center ms-4">
                    <label for="repetirPassword" class="form-label mb-0 text-nowrap flex-shrink-0 me-2">Repetir
                        Contraseña:</label>
                    <input type="password" id="repetirPassword" v-model="repetirPassword"
                        class="form-control flex-grow-1" :required="!editando" autocomplete="new-password" />
                </div>
            </div>
            <!-- Aceptar condiciones + Histórico -->
            <div class="mb-4">
                <div class="d-flex align-items-center justify-content-between position-relative">
                    <!-- Espacio izquierdo vacío para equilibrar -->
                    <div style="flex: 1"></div>

                    <!-- Aceptar condiciones y términos (centro absoluto) -->
                    <div class="position-absolute start-50 translate-middle-x">
                        <div class="form-check d-flex align-items-center">
                            <input type="checkbox" id="avisoLegal" class="form-check-input me-2"
                                v-model="nuevoEmpleado.lopd" required />
                            <label for="AvisoLegal" class="form-check-label mb-0 text-nowrap">
                                Aceptar términos y condiciones:
                                <a target="_blank" class="text-decoration-none" href="/avisolegal">
                                    Aviso Legal
                                </a>
                            </label>
                        </div>
                    </div>

                    <!-- Histórico (derecha) -->
                    <div v-if="admin" class="ms-auto me-5">
                        <div class="form-switch d-flex align-items-center">
                            <input type="checkbox" id="historico" v-model="mostrarHistorico"
                                class="form-check-input me-2" @change="cargarEmpleados" />
                            <label for="historico" class="form-check-label mb-0">Histórico</label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Botones centrados -->
            <div class="d-flex justify-content-center align-items-center gap-3">
                <button type="submit" class="btn btn-primary border-0 shadow-none rounded-0">
                    {{ editando ? "Modificar Empleado" : "Guardar" }}
                </button>
                <button v-if="admin" type="button" class="btn btn-success border-0 shadow-none rounded-0"
                    @click="imprimirListadoEmpleados" title="Descargar listado de empleados en PDF">
                    <i class="bi bi-printer-fill me-2"></i>Imprimir Listado
                </button>
            </div>
        </form>
    </div>

    <!-- Lista de Empleados -->
    <div v-if="admin" class="table-responsive">
        <h4 class="text-center w-100">Listado Empleados</h4>
        <table class="table table-bordered table-striped table-hover table-sm align-middle">
            <thead class="table-primary">
                <tr>
                    <th class="text-center" scope="col">ID</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Nombre</th>
                    <th class="text-center" scope="col">Tipo</th>
                    <th class="text-center" scope="col">Móvil</th>
                    <th class="text-center" scope="col">Municipio</th>
                    <th class="text-center" scope="col" style="width: 150px">
                        Acciones
                    </th>
                </tr>
                <!-- Fila de filtros -->
                <tr class="table-light">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>
                        <select v-model="filtroTipoEmpleado" class="form-select form-select-sm border-0 shadow-none">
                            <option value="">Todos</option>
                            <option value="particular">Particular</option>
                            <option value="empresa">Empresa</option>
                        </select>
                    </th>
                    <th></th>
                    <th>
                        <select v-model="filtroMunicipio" class="form-select form-select-sm border-0 shadow-none">
                            <option value="">Todos los municipios</option>
                            <option v-for="mun in municipiosUnicos" :key="mun" :value="mun">{{ mun }}</option>
                        </select>
                    </th>
                    <th class="text-center">
                        <button @click="limpiarFiltrosEmpleados" class="btn btn-outline-secondary btn-sm"
                            title="Limpiar filtros">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(empleado, index) in empleadosPaginados" :key="empleado.id || index">
                    <th scope="row" class="text-center">{{ (currentPage - 1) * empleadosPerPage + index + 1 }}</th>
                    <td>{{ empleado.apellidos }}</td>
                    <td>{{ empleado.nombre }}</td>
                    <td class="text-center">
                        <span class="badge"
                            :class="empleado.tipo === 'empresa' || empleado.tipoEmpleado === 'empresa' ? 'bg-info' : 'bg-secondary'">
                            {{ empleado.tipo === 'empresa' || empleado.tipoEmpleado === 'empresa' ? 'Empresa' :
                                'Particular' }}
                        </span>
                    </td>
                    <td class="text-center">{{ empleado.movil }}</td>
                    <td class="text-center">{{ empleado.municipio }}</td>
                    <td class="text-start">

                        <button @click="eliminarEmpleado(empleado.movil)"
                            class="btn btn-danger btn-sm border-0 ms-4 me-2 shadow-none rounded-0">
                            <i class="bi bi-trash"></i>
                        </button>

                        <button @click="editarEmpleado(empleado.movil)"
                            class="btn btn-warning btn-sm shadow-none rounded-0" title="Editar empleado"
                            aria-label="Editar empleado">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button v-if="empleado.historico === false" @click="activarEmpleado(empleado)"
                            class="btn btn-secondary btn-sm ms-2 border-0 shadow-none rounded-0"
                            title="Activar empleado">
                            <i class="bi bi-person-check"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Navegación de página-->
    <div v-if="admin" class="d-flex justify-content-center my-3">
        <button class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none" @click="beforePagina"
            :disabled="currentPage <= 1">
            <i class="bi bi-chevron-left "></i>
        </button>
        <span class="mx-3 align-self-center text-muted">Página {{ currentPage }}</span>
        <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" @click="nextPagina"
            :disabled="currentPage >= totalPages">
            <i class="bi bi-chevron-right "></i>
        </button>
    </div>
</template>
<script setup>

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import provmuniData from "../../backend/data/provmuni.json";
import Swal from "sweetalert2";
import { getEmpleados, deleteEmpleado, addEmpleado, updateEmpleado, getEmpleadoPorDni, getDni, getEmpleadoLogueado } from "@/api/empleados.js";
import { registerUsuario, loginUsuario, checkAdmin } from "@/api/authApi.js";
import bcrypt from "bcryptjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// const router = useRouter();

/* =================================== SCRIPT CRUD =================================== */
const empleadoVacio = {
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fecha_alta: "",
    tipoEmpleado: "user",
    historico: false,
    lopd: false,
    password: ""
}

const nuevoEmpleado = ref({
    ...empleadoVacio
});

const repetirPassword = ref("");

const editando = ref(false);
const empleadoEditandoId = ref(null);

const mostrarHistorico = ref(false);

const numEmpleados = ref(0);
const currentPage = ref(1);
const empleadosPerPage = ref(10);

// Filtros de la tabla
const filtroTipoEmpleado = ref('');
const filtroMunicipio = ref('');

const isAdmin = ref(false);
const admin = ref(false)

/// se carga en el onmounted ya que necesita llamar al back
var dni;

/*/// Computed: verifica si está editando su propio perfil
const editingCurrentUser = computed(() => {
  return nuevoEmpleado.value.dni === dni && editando.value;
});*/

/// Función Listar Empleados con get
const empleados = ref([]);

/// Cargar empleados al montar el componente
// Zona Cargar empleados Al Montar el componente 
onMounted(async () => {
    const adminCheck = await checkAdmin();
    admin.value = adminCheck.isAdmin;
    isAdmin.value = adminCheck.isAdmin;

    if (isAdmin.value) {
        cargarEmpleados();
    }

    // SI NO ESTÁS EDITANDO, CARGA TUS DATOS EN EL FORMULARIO
    if (!editando.value) {
        const empleado = await getEmpleadoLogueado();
        console.log('Datos de mi perfil:', empleado);
        if (empleado) {
            nuevoEmpleado.value = {
                ...empleado,
                password: "",
                tipoEmpleado: empleado.tipo || "user" // Mapear tipo -> tipoEmpleado
            };
            nuevoEmpleado.value.fecha_alta = formatearFechaParaInput(empleado.fecha_alta);

            // Activar modo edición para usuarios que están viendo su propio perfil
            if (!isAdmin.value) {
                editando.value = true;
                empleadoEditandoId.value = empleado.id;
            }
        }
    }
});

const updateTabla = () => {
    getEmpleados(mostrarHistorico.value)
        .then(data => {
            empleados.value = data
            numEmpleados.value = data.length
        })
        .catch(error => {
            console.error('Error cargando empleados:', error);
            if (error.response?.status === 401) {
                // Token inválido o expirado
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión expirada',
                    text: 'Por favor, inicie sesión nuevamente',
                    showConfirmButton: true
                });
            }
        })
}

///avanzar y retroceder

// Métodos de paginación
const beforePagina = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPagina = () => {
    //redondear hacia arriba para mostrar la última página aunque no esté completa

    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

// Filtrado de empleados
const empleadosFiltrados = computed(() => {
    return empleados.value.filter(c => {
        const coincideTipo = !filtroTipoEmpleado.value || c.tipo === filtroTipoEmpleado.value || c.tipoEmpleado === filtroTipoEmpleado.value;
        const coincideMunicipio = !filtroMunicipio.value || c.municipio === filtroMunicipio.value;
        return coincideTipo && coincideMunicipio;
    });
});

const empleadosPaginados = computed(() => {
    const start = (currentPage.value - 1) * empleadosPerPage.value
    const end = start + empleadosPerPage.value
    return empleadosFiltrados.value.slice(start, end)
})

// Obtener municipios únicos para el filtro
const municipiosUnicos = computed(() => {
    const municipios = empleados.value.map(c => c.municipio).filter(Boolean);
    return [...new Set(municipios)].sort();
});

// Limpiar filtros
const limpiarFiltrosEmpleados = () => {
    filtroTipoEmpleado.value = '';
    filtroMunicipio.value = '';
    currentPage.value = 1;
};


const cargarEmpleados = () => {
    updateTabla()
    Swal.fire({
        icon: 'success',
        title: "Listando Empleados...",
        showConfirmButton: false,
        timer: 1500
    });
}

const totalPages = computed(() => {
    return Math.ceil(empleadosFiltrados.value.length / empleadosPerPage.value)
})


const guardarEmpleado = async () => {
    // Validar contraseñas
    if (nuevoEmpleado.value.password !== repetirPassword.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error en contraseña',
            text: 'Las contraseñas no coinciden.',
            showConfirmButton: true
        });
        return;
    }

    // Validar duplicados solo si estás creando (no si editando)
    if (!editando.value) {
        const duplicado = empleados.value.find(empleado =>
            empleado.dni === nuevoEmpleado.value.dni ||
            empleado.movil === nuevoEmpleado.value.movil ||
            empleado.email === nuevoEmpleado.value.email
        );
        if (duplicado) {
            Swal.fire({
                icon: 'error',
                title: 'DNI, móvil o email duplicados',
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }
    }

    // Confirmación antes de guardar
    const result = await Swal.fire({
        title: editando.value ? '¿Desea modificar este empleado?' : '¿Desea grabar este empleado?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
        if (editando.value) {
            // MODIFICAR EMPLEADO EXISTENTE
            const datosActualizados = { ...nuevoEmpleado.value };
            if (nuevoEmpleado.value.password) {
                const salt = bcrypt.genSaltSync(10);
                datosActualizados.password = bcrypt.hashSync(nuevoEmpleado.value.password, salt);
            } else {
                delete datosActualizados.password;
            }
            await updateEmpleado(empleadoEditandoId.value, datosActualizados); // <-- MODIFICA EL EXISTENTE

            Swal.fire({
                icon: 'success',
                title: 'Empleado modificado',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            // CREAR NUEVO EMPLEADO
            await registerUsuario({
                dni: nuevoEmpleado.value.dni,
                password: nuevoEmpleado.value.password,
                nombre: nuevoEmpleado.value.nombre,
                apellidos: nuevoEmpleado.value.apellidos,
                email: nuevoEmpleado.value.email,
                movil: nuevoEmpleado.value.movil,
                direccion: nuevoEmpleado.value.direccion,
                provincia: nuevoEmpleado.value.provincia,
                municipio: nuevoEmpleado.value.municipio,
                fecha_alta: nuevoEmpleado.value.fecha_alta,
                tipo: nuevoEmpleado.value.tipoEmpleado,
                lopd: nuevoEmpleado.value.lopd
            });

            Swal.fire({
                icon: 'success',
                title: 'Empleado agregado',
                showConfirmButton: false,
                timer: 1500
            });
        }

        // Reset formulario y estado
        nuevoEmpleado.value = { ...empleadoVacio };
        editando.value = false;
        empleadoEditandoId.value = null;
        repetirPassword.value = "";

        // Refrescar lista completa
        updateTabla();

    } catch (error) {
        console.error('Error al guardar empleado:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar empleado',
            text: error?.response?.data?.message || error.message || 'Inténtelo de nuevo o contacte con el administrador.',
            showConfirmButton: false,
            timer: 3000
        });
    }
};

// Funcion Eliminar Empleado con patch (histórico a false)
const eliminarEmpleado = async (movil) => {
    // Refrescar lista desde la API
    cargarEmpleados();
    // Buscar empleado completo (que incluye el ID)
    const empleadoAEliminar = empleados.value.find(empleado => empleado.movil === movil);

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

    // Si confirma, eliminar empleado usando la API y movil como ID
    await deleteEmpleado(empleadoAEliminar.id);
    // Refrescar la lista desde la "API"
    cargarEmpleados(); // <-- Solo llama a la función, no asignes el resultado

    Swal.fire({
        icon: 'success',
        title: 'Empleado eliminado',
        showConfirmButton: false,
        timer: 1500
    });
};


// Función Editar Empleado (carga datos en el formulario)
const editarEmpleado = (movil) => {
    const empleado = empleados.value.find((c) => c.movil === movil);
    nuevoEmpleado.value = { ...empleado, password: "" };
    editando.value = true;
    empleadoEditandoId.value = empleado.id; // <-- ESTA LÍNEA ES CLAVE
    nuevoEmpleado.value.fecha_alta = formatearFechaParaInput(empleado.fecha_alta);
}


const activarEmpleado = async (empleado) => {
    const confirmacion = await Swal.fire({
        title: `¿Activar empleado ${empleado.nombre} ${empleado.apellidos}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Activar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
        // Crear una copia del empleado con historico en true
        const empleadoActivado = { ...empleado, historico: false };

        // Llamar a la API para actualizar
        const actualizado = await updateEmpleado(empleado.id, empleadoActivado);

        // Actualizar la lista local (opcional, también puedes volver a cargar todo)
        const index = empleados.value.findIndex(c => c.id === empleado.id);
        if (index !== -1) {
            empleados.value[index] = actualizado;
        }

        Swal.fire({
            icon: 'success',
            title: 'Empleado reactivado',
            showConfirmButton: false,
            timer: 1500
        });

        // Recargar lista actualizada
        cargarEmpleados();

    } catch (error) {
        console.error('Error al reactivar empleado:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al activar empleado',
            text: 'Por favor, intenta de nuevo.',
            timer: 1500
        });
    }
};

///CODIGO BUSQUEDA COMPONENTES

const buscarEmpleadoPorDNI = async (dni) => {
    if (!dni || dni.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Debe introducir un DNI antes de buscar.',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    try {
        const empleado = await getEmpleadoPorDni(dni.trim().toUpperCase());
        console.log('Datos de mi perfil:', empleado); // <-- Añade esto

        if (!empleado) {
            Swal.fire({
                icon: 'info',
                title: 'Empleado no encontrado',
                text: 'No existe ningún empleado con ese DNI.',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        // ✅ Cargar los datos en el formulario
        nuevoEmpleado.value = { ...empleado, password: "" };
        nuevoEmpleado.value.fecha_alta = formatearFechaParaInput(empleado.fecha_alta);

        // Actualiza lista de municipios si cambia la provincia
        filtrarMunicipios();
        nuevoEmpleado.value.municipio = empleado.municipio;

        //opcional
        editando.value = true;
        empleadoEditandoId.value = empleado.id;

        Swal.fire({
            icon: 'success',
            title: 'Empleado encontrado y cargado',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error buscando empleado por DNI:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al buscar empleado',
            text: 'Verifique la conexión o contacte con el administrador.',
            timer: 2000,
            showConfirmButton: false
        });
    }
}
const vaciarFormulario = async () => {
    nuevoEmpleado.value = { ...empleadoVacio };
    repetirPassword.value = "";
    editando.value = false;
    empleadoEditandoId.value = null;

    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;
}

// Función para refrescar/limpiar el formulario (alias de vaciarFormulario)
const refrescarPagina = () => {
    vaciarFormulario();
    Swal.fire({
        icon: 'success',
        title: 'Formulario limpiado',
        showConfirmButton: false,
        timer: 1000
    });
}

/* =================================== SCRIPT AUXILIARES =================================== */

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true); // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

    valor = valor.toUpperCase();

    if (dniRegex.test(valor)) {
        const numero = parseInt(valor.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23]; //sale con true si es válido
    } else if (nieRegex.test(valor)) {
        const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
        const numero = parseInt(nie.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23]; //sale con true si es válido
    }
    return false;
};

// Validar al salir del campo
const validarDni = () => {
    const dni = nuevoEmpleado.value.dni.trim().toUpperCase();
    dniValido.value = validarDniNie(dni);
};

// Función única: capitaliza y asigna en el mismo paso
const capitalizarTexto = (campo) => {
    const texto = nuevoEmpleado.value[campo] ?? "";
    nuevoEmpleado.value[campo] = texto
        .toLowerCase()
        .split(" ")
        .map((palabra) => {
            if (!palabra) return "";
            return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
        })
        .join(" ");
};

// Validar email
const emailValido = ref(true);
const validarEmail = () => {
    const email = nuevoEmpleado.value.email.trim();
    // Expresión simple para email válido
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    emailValido.value = regex.test(email);
};

// Validar móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
    const movil = nuevoEmpleado.value.movil.trim();

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

// Provincias y municipios
const provincias = ref(provmuniData.provincias); // Array de provincias
const municipios = ref(provmuniData.municipios); // Array de municipios para filtrarlos
const municipiosFiltrados = ref([]); // vacío pero contendrá los municipios filtrados

const filtrarMunicipios = () => {
    // nombre de la provincia elegida en el <select>
    const nombreProv = nuevoEmpleado.value.provincia;

    // 1️⃣ buscar en provincias el objeto con ese nombre
    const prov = provincias.value.find((p) => p.nm === nombreProv);
    if (!prov) {
        municipiosFiltrados.value = [];
        return;
    }

    // 2️⃣ los dos primeros dígitos del id de la provincia
    const codigoProv = prov.id.slice(0, 2);

    // 3️⃣ filtrar los municipios cuyo id empiece por esos dos dígitos
    municipiosFiltrados.value = municipios.value.filter((m) =>
        m.id.startsWith(codigoProv)
    );

    // 4️⃣ opcional: resetear el municipio si ya no corresponde
    nuevoEmpleado.value.municipio = "";
};

// conversor fecha
function formatearFechaParaInput(fecha) {
    if (!fecha) return '';

    // Detecta formato dd/mm/yyyy
    if (fecha.includes('/')) {
        const [dd, mm, yyyy] = fecha.split('/');
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }

    // Detecta formato yyyy-mm-dd
    if (fecha.includes('-')) {
        const partes = fecha.split('-');
        if (partes.length === 3) return fecha.slice(0, 10); // solo yyyy-mm-dd
    }

    // Detecta formato ISO (ejemplo: 2026-01-21T00:00:00.000Z)
    if (fecha.length >= 10 && fecha[4] === '-' && fecha[7] === '-') {
        return fecha.slice(0, 10);
    }

    return '';
}

// Función para imprimir/descargar listado de empleados en PDF
const imprimirListadoEmpleados = async () => {
    try {
        // Mostrar indicador de carga
        Swal.fire({
            title: 'Generando PDF...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Obtener todos los empleados (sin filtro de paginación)
        const todosLosEmpleados = await getEmpleados(mostrarHistorico.value);

        // Crear documento PDF
        const doc = new jsPDF('landscape'); // Orientación horizontal para más columnas

        // Título
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Listado de Empleados - García Alonso', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

        // Fecha de generación y total de empleados en la misma línea
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const fechaHoy = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const pageWidth = doc.internal.pageSize.getWidth();

        // Fecha a la izquierda
        doc.text(`Generado el: ${fechaHoy}`, 14, 22);

        // Total de empleados a la derecha
        doc.setFont(undefined, 'bold');
        doc.text(`Total de empleados: ${todosLosEmpleados.length}`, pageWidth - 14, 22, { align: 'right' });
        doc.setFont(undefined, 'normal');

        // Preparar datos para la tabla
        const datosTabla = todosLosEmpleados.map((empleado, index) => [
            index + 1,
            empleado.dni || '-',
            empleado.apellidos || '-',
            empleado.nombre || '-',
            empleado.email || '-',
            empleado.movil || '-',
            empleado.direccion || '-',
            empleado.municipio || '-',
            empleado.provincia || '-',
            empleado.fecha_alta ? formatearFechaParaInput(empleado.fecha_alta) : '-',
            empleado.tipo || empleado.tipoEmpleado || 'user',
            empleado.historico ? 'Sí' : 'No'
        ]);

        // Generar tabla con autoTable
        autoTable(doc, {
            startY: 28,
            head: [['#', 'DNI', 'Apellidos', 'Nombre', 'Email', 'Móvil', 'Dirección', 'Municipio', 'Provincia', 'Fecha Alta', 'Tipo', 'Activo']],
            body: datosTabla,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [13, 110, 253], // Color azul Bootstrap primary
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' }, // #
                1: { cellWidth: 20, halign: 'center' }, // DNI
                2: { cellWidth: 30 }, // Apellidos
                3: { cellWidth: 25 }, // Nombre
                4: { cellWidth: 40 }, // Email
                5: { cellWidth: 20, halign: 'center' }, // Móvil
                6: { cellWidth: 35 }, // Dirección
                7: { cellWidth: 25 }, // Municipio
                8: { cellWidth: 25 }, // Provincia
                9: { cellWidth: 22, halign: 'center' }, // Fecha Alta
                10: { cellWidth: 15, halign: 'center' }, // Tipo
                11: { cellWidth: 15, halign: 'center' } // Activo
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { top: 28 }
        });

        // Descargar el PDF
        const nombreArchivo = `Listado_Empleados_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nombreArchivo);

        // Cerrar el indicador de carga y mostrar éxito
        Swal.fire({
            icon: 'success',
            title: 'PDF generado',
            text: `Se ha descargado el archivo: ${nombreArchivo}`,
            timer: 2500,
            showConfirmButton: false
        });

    } catch (error) {
        console.error('Error generando PDF:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al generar PDF',
            text: 'No se pudo generar el listado. Por favor, inténtelo de nuevo.',
            showConfirmButton: true
        });
    }
};

</script>
<style scoped></style>