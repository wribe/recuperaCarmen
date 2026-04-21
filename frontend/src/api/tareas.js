const API_URL = 'http://localhost:3000/tareas';

/**
 * Obtener todas las tareas
 */
export const getTareas = () => {
    return fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error fetching tareas:', error);
            throw error;
        });
};

/**
 * Obtener una tarea por ID
 */
export const getTareaById = (id) => {
    return fetch(`${API_URL}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error fetching tarea:', error);
            throw error;
        });
};

/**
 * Crear una nueva tarea
 */
export const addTarea = (tarea) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea),
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error creating tarea:', error);
            throw error;
        });
};

/**
 * Actualizar una tarea (PUT)
 */
export const updateTarea = (id, tarea) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarea),
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error updating tarea:', error);
            throw error;
        });
};

/**
 * Eliminar una tarea
 */
export const deleteTarea = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error deleting tarea:', error);
            throw error;
        });
};
