const API_URL = 'http://localhost:3000/facturas';

/**
 * Obtener todas las facturas
 */
export const getFacturas = () => {
    return fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error fetching facturas:', error);
            throw error;
        });
};

/**
 * Obtener una factura por ID
 */
export const getFacturaById = (id) => {
    return fetch(`${API_URL}/${id}`)
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error fetching factura:', error);
            throw error;
        });
};

/**
 * Crear una nueva factura
 */
export const addFactura = (factura) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(factura),
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error creating factura:', error);
            throw error;
        });
};

/**
 * Actualizar una factura
 */
export const updateFactura = (id, factura) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(factura),
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error updating factura:', error);
            throw error;
        });
};

/**
 * Eliminar una factura
 */
export const deleteFactura = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
            return res.json();
        })
        .catch(error => {
            console.error('Error deleting factura:', error);
            throw error;
        });
};

/**
 * Generar número de factura único
 */
export const generarNumeroFactura = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `FAC-${timestamp}-${random}`;
};

/**
 * Calcular total de factura
 */
export const calcularTotalFactura = (tareas) => {
    return tareas.reduce((total, tarea) => total + (tarea.total || 0), 0);
};
