import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import ModalConfirm from '../components/ModalConfirm';
import '../components/ModalConfirm.css';
import './CartPage.css';

function CartPage() {
  const { items, actualizarCantidad, eliminarItem, vaciarCarrito, total } = useCarrito();
  const [modal, setModal] = useState(null);

  const confirmar = (mensaje, accion) => setModal({ mensaje, accion });
  const cerrarModal = () => setModal(null);
  const ejecutar = () => { modal.accion(); cerrarModal(); };

  if (items.length === 0) {
    return (
      <main className="carrito-vacio">
        <h1>Tu carrito está vacío</h1>
        <p>Explorá nuestro catálogo y encontrá tus accesorios favoritos.</p>
        <Link to="/catalogo" className="carrito-btn-catalogo">Ver catálogo</Link>
      </main>
    );
  }

  return (
    <main className="carrito">
      {modal && (
        <ModalConfirm
          mensaje={modal.mensaje}
          onConfirmar={ejecutar}
          onCancelar={cerrarModal}
        />
      )}

      <div className="carrito-header">
        <h1>Mi carrito</h1>
      </div>

      <div className="carrito-contenido">
        <div className="carrito-items">
          {items.map((item) => (
            <div key={item._id} className="carrito-item">
              <div className="carrito-item-imagen">
                {item.imagen ? (
                  <img src={item.imagen} alt={item.nombre} />
                ) : (
                  <div className="carrito-item-placeholder">{item.categoria}</div>
                )}
              </div>
              <div className="carrito-item-info">
                <p className="carrito-item-categoria">{item.categoria}</p>
                <h3 className="carrito-item-nombre">{item.nombre}</h3>
                <p className="carrito-item-precio">
                  ${Number(item.precio).toLocaleString('es-AR')}
                </p>
              </div>
              <div className="carrito-item-controles">
                <button
                  className="carrito-cantidad-btn"
                  onClick={() => {
                    if (item.cantidad === 1) {
                      confirmar(
                        `¿Eliminás "${item.nombre}" del carrito?`,
                        () => eliminarItem(item._id)
                      );
                    } else {
                      actualizarCantidad(item._id, item.cantidad - 1);
                    }
                  }}
                >
                  −
                </button>
                <span className="carrito-cantidad">{item.cantidad}</span>
                {(item.stock == null || item.cantidad < item.stock) && (
                  <button
                    className="carrito-cantidad-btn"
                    onClick={() => actualizarCantidad(item._id, item.cantidad + 1)}
                  >
                    +
                  </button>
                )}
              </div>
              <p className="carrito-item-subtotal">
                ${Number(item.precio * item.cantidad).toLocaleString('es-AR')}
              </p>
              <button
                className="carrito-item-eliminar"
                onClick={() =>
                  confirmar(
                    `¿Eliminás "${item.nombre}" del carrito?`,
                    () => eliminarItem(item._id)
                  )
                }
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <h2>Resumen</h2>
          {items.map((item) => (
            <div key={item._id} className="carrito-resumen-fila">
              <span className="carrito-resumen-item-nombre">{item.nombre}</span>
              <span className="carrito-resumen-item-qty">× {item.cantidad}</span>
              <span className="carrito-resumen-item-precio">${Number(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
            </div>
          ))}
          <div className="carrito-resumen-fila carrito-resumen-total">
            <span>Total</span>
            <span>${Number(total).toLocaleString('es-AR')}</span>
          </div>
          <Link to="/checkout" className="carrito-btn-comprar">
            Continuar compra
          </Link>
          <button
            className="carrito-vaciar carrito-vaciar-resumen"
            onClick={() => confirmar('¿Querés vaciar el carrito?', vaciarCarrito)}
          >
            Vaciar carrito
          </button>
          <Link to="/catalogo" className="carrito-btn-seguir">
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
