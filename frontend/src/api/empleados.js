const API_URL = 'http://localhost:3000/empleados';

/**
 * Obtener todos los empleados
 */
export const getEmpleados = () => {
    return fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error fetching empleados:', error);
            throw error;
        });
};

/**
 * Obtener un empleado por ID
 */
export const getEmpleadoById = (id) => {
    return fetch(`${API_URL}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error fetching empleado:', error);
            throw error;
        });
};

/**
 * Crear un nuevo empleado
 */
export const addEmpleado = (empleado) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleado),
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error creating empleado:', error);
            throw error;
        });
};

/**
 * Actualizar un empleado (PUT)
 */
export const updateEmpleado = (id, empleado) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleado),
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error updating empleado:', error);
            throw error;
        });
};

/**
 * Eliminar un empleado
 */
export const deleteEmpleado = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error deleting empleado:', error);
            throw error;
        });
};
