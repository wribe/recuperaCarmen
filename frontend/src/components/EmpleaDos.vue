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
                            ]" :readonly="editando" required oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
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
<script setup></script>
<style scoped></style>