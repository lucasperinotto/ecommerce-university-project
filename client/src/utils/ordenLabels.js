const ESTADOS = {
  'pendiente de pago': 'Pendiente de pago',
  procesando: 'En preparación',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const METODOS_PAGO = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia bancaria',
};

export const labelEstado = (estado) => ESTADOS[estado] || estado;

export const labelMetodoPago = (metodoPago) => METODOS_PAGO[metodoPago] || metodoPago;
