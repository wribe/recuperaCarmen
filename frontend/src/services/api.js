// Configuración del servidor JSON
const API_BASE_URL = 'http://localhost:3000';

// ========================= EMPLEADOS =========================

/**
 * Obtener todos los empleados
 */
export const getEmpleados = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching empleados:', error);
    throw error;
  }
};

/**
 * Obtener un empleado por ID
 */
export const getEmpleadoById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching empleado:', error);
    throw error;
  }
};

/**
 * Crear un nuevo empleado
 */
export const createEmpleado = async (empleado) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleado),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating empleado:', error);
    throw error;
  }
};

/**
 * Actualizar un empleado (PUT)
 */
export const updateEmpleado = async (id, empleado) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleado),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating empleado:', error);
    throw error;
  }
};

/**
 * Eliminar un empleado
 */
export const deleteEmpleado = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error deleting empleado:', error);
    throw error;
  }
};

// ========================= TAREAS =========================

/**
 * Obtener todas las tareas
 */
export const getTareas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tareas`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching tareas:', error);
    throw error;
  }
};

/**
 * Obtener una tarea por ID
 */
export const getTareaById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching tarea:', error);
    throw error;
  }
};

/**
 * Crear una nueva tarea
 */
export const createTarea = async (tarea) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tarea),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating tarea:', error);
    throw error;
  }
};

/**
 * Actualizar una tarea (PUT)
 */
export const updateTarea = async (id, tarea) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tarea),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error updating tarea:', error);
    throw error;
  }
};

/**
 * Eliminar una tarea
 */
export const deleteTarea = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error deleting tarea:', error);
    throw error;
  }
};
