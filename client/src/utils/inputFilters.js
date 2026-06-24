export const soloLetras = (value) => value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');

export const soloNumeros = (value) => value.replace(/[^0-9]/g, '');
