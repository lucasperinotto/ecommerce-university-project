import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductos } from '../services/productosService';
import ProductCard from '../components/ProductCard';
import './CatalogPage.css';

function CatalogPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const categoriaFiltro = searchParams.get('categoria');

  useEffect(() => {
    getProductos()
      .then((res) => setProductos(res.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="catalogo-estado">Cargando productos...</p>;
  if (error) return <p className="catalogo-estado catalogo-error">{error}</p>;

  const productosFiltrados = categoriaFiltro
    ? productos.filter((p) => p.categoria === categoriaFiltro)
    : productos;

  const titulo = categoriaFiltro
    ? categoriaFiltro.charAt(0) + categoriaFiltro.slice(1).toLowerCase()
    : 'Catálogo';

  return (
    <main className="catalogo">
      <div className="catalogo-header">
        <h1>{titulo}</h1>
        <p>{productosFiltrados.length} productos</p>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="catalogo-estado">No hay productos disponibles.</p>
      ) : (
        <div className="catalogo-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}

export default CatalogPage;
