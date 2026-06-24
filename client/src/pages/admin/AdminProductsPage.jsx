import { useEffect, useState } from 'react';
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  bajaLogicaProducto,
  restaurarProducto,
} from '../../services/productosService';
import Spinner from '../../components/Spinner';
import ModalConfirm from '../../components/ModalConfirm';
import { useToast } from '../../context/ToastContext';
import useTitulo from '../../hooks/useTitulo';
import './AdminPage.css';

const CATEGORIAS = ['anillos', 'aros', 'carteras', 'collares'];
const FORM_VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  cantidad: '',
  imagen: '',
  categoria: 'anillos',
};

function AdminProductsPage() {
  useTitulo('Admin - Productos');
  const { showToast } = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [formError, setFormError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [modal, setModal] = useState(null);
  const confirmar = (mensaje, accion) => setModal({ mensaje, accion });
  const cerrarModal = () => setModal(null);
  const ejecutar = () => { modal.accion(); cerrarModal(); };

  const fetchProductos = async () => {
    try {
      const { data } = await getProductos();
      setProductos(data);
    } catch {
      setError('Error al cargar los productos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { fetchProductos(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setFormError('');
    setFormVisible(true);
  };

  const abrirEditar = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: String(producto.precio),
      cantidad: String(producto.cantidad),
      imagen: producto.imagen || '',
      categoria: producto.categoria,
    });
    setEditandoId(producto._id);
    setFormError('');
    setFormVisible(true);
  };

  const cancelar = () => {
    setFormVisible(false);
    setEditandoId(null);
    setForm(FORM_VACIO);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setGuardando(true);
    try {
      const datos = {
        ...form,
        precio: Number(form.precio),
        cantidad: Number(form.cantidad),
      };
      if (editandoId) {
        await actualizarProducto(editandoId, datos);
        showToast('Producto actualizado con éxito.');
      } else {
        await crearProducto(datos);
        showToast('Producto creado con éxito.');
      }
      await fetchProductos();
      cancelar();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Error al guardar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  const handleBaja = (id) => {
    confirmar('¿Dar de baja este producto?', async () => {
      try {
        await bajaLogicaProducto(id);
        await fetchProductos();
        showToast('Producto dado de baja.');
      } catch {
        showToast('Error al dar de baja el producto.', 'error');
      }
    });
  };

  const handleRestaurar = async (id) => {
    try {
      await restaurarProducto(id);
      await fetchProductos();
      showToast('Producto restaurado con éxito.');
    } catch {
      showToast('Error al restaurar el producto.', 'error');
    }
  };

  if (cargando) return <Spinner texto="Cargando productos..." />;
  if (error) return <p className="pagina-estado pagina-error">{error}</p>;

  return (
    <main className="admin-page">
      {modal && <ModalConfirm mensaje={modal.mensaje} onConfirmar={ejecutar} onCancelar={cerrarModal} />}
      <div className="admin-header">
        <h1>Gestión de productos</h1>
        <button className="admin-btn-nuevo" onClick={abrirCrear}>
          + Nuevo producto
        </button>
      </div>

      {formVisible && (
        <div className="admin-form-wrap">
          <h2>{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre <span className="campo-requerido">*</span></label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Descripción <span className="campo-requerido">*</span></label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Precio ($) <span className="campo-requerido">*</span></label>
                <input
                  name="precio"
                  type="number"
                  min="1"
                  value={form.precio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock <span className="campo-requerido">*</span></label>
                <input
                  name="cantidad"
                  type="number"
                  min="0"
                  value={form.cantidad}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>URL de imagen <span className="campo-requerido">*</span></label>
              <input name="imagen" value={form.imagen} onChange={handleChange} required />
            </div>
            {formError && <p className="auth-error">{formError}</p>}
            <div className="admin-form-acciones">
              <button type="submit" className="admin-btn-guardar" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" className="admin-btn-cancelar" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-tabla-wrap">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id} className={p.estado === 'inactivo' ? 'fila-inactiva' : ''}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${Number(p.precio).toLocaleString('es-AR')}</td>
                <td>{p.cantidad}</td>
                <td>
                  <span className={`admin-badge ${p.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="admin-acciones">
                  {p.estado === 'activo' ? (
                    <>
                      <button className="admin-btn-accion" onClick={() => abrirEditar(p)}>
                        Editar
                      </button>
                      <button className="admin-btn-baja" onClick={() => handleBaja(p._id)}>
                        Dar de baja
                      </button>
                    </>
                  ) : (
                    <button className="admin-btn-restaurar" onClick={() => handleRestaurar(p._id)}>
                      Restaurar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminProductsPage;
