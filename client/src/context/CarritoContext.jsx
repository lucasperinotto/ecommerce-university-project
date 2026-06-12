import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext(null);

function leerCarrito() {
  try { return JSON.parse(localStorage.getItem('carrito')) || []; } catch { return []; }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);

  const agregarItem = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existe = prev.find((i) => i._id === producto._id);
      const stockMax = producto.cantidad ?? null;
      if (existe) {
        const nuevaCantidad = stockMax !== null
          ? Math.min(existe.cantidad + cantidad, stockMax)
          : existe.cantidad + cantidad;
        if (nuevaCantidad === existe.cantidad) return prev;
        const siguiente = prev.map((i) =>
          i._id === producto._id ? { ...i, cantidad: nuevaCantidad } : i
        );
        localStorage.setItem('carrito', JSON.stringify(siguiente));
        return siguiente;
      }
      const siguiente = [
        ...prev,
        {
          _id: producto._id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          categoria: producto.categoria,
          stock: stockMax,
          cantidad: stockMax !== null ? Math.min(cantidad, stockMax) : cantidad,
        },
      ];
      localStorage.setItem('carrito', JSON.stringify(siguiente));
      return siguiente;
    });
  };

  const actualizarCantidad = (id, cantidad) => {
    setItems((prev) => {
      const item = prev.find((i) => i._id === id);
      const stockMax = item?.stock ?? null;
      const cantidadFinal = stockMax !== null ? Math.min(cantidad, stockMax) : cantidad;
      const siguiente =
        cantidadFinal <= 0
          ? prev.filter((i) => i._id !== id)
          : prev.map((i) => (i._id === id ? { ...i, cantidad: cantidadFinal } : i));
      localStorage.setItem('carrito', JSON.stringify(siguiente));
      return siguiente;
    });
  };

  const eliminarItem = (id) => {
    setItems((prev) => {
      const siguiente = prev.filter((i) => i._id !== id);
      localStorage.setItem('carrito', JSON.stringify(siguiente));
      return siguiente;
    });
  };

  const vaciarCarrito = () => {
    localStorage.removeItem('carrito');
    setItems([]);
  };

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, agregarItem, actualizarCantidad, eliminarItem, vaciarCarrito, total, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
