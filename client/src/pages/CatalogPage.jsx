import { useEffect, useState } from 'react';
import { getProductos } from '../services/productosService';
import ProductCard from '../components/ProductCard';
import './CatalogPage.css';

function CatalogPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProductos()
      .then((res) => setProductos(res.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="catalogo-estado">Cargando productos...</p>;
  if (error) return <p className="catalogo-estado catalogo-error">{error}</p>;

  return (
    <main className="catalogo">
      <div className="catalogo-header">
        <h1>Catálogo</h1>
        <p>{productos.length} productos</p>
      </div>

      {productos.length === 0 ? (
        <p className="catalogo-estado">No hay productos disponibles.</p>
      ) : (
        <div className="catalogo-grid">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}

export default CatalogPage;
