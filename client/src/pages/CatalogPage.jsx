import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductos } from '../services/productosService';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import useTitulo from '../hooks/useTitulo';
import './CatalogPage.css';

function CatalogPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const categoriaFiltro = searchParams.get('categoria');
  useTitulo(categoriaFiltro ? `Catálogo - ${categoriaFiltro.charAt(0).toUpperCase()}${categoriaFiltro.slice(1)}` : 'Catálogo');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await getProductos();
        setProductos(data.filter((p) => p.estado !== 'inactivo'));
      } catch (err) {
        setError('No se pudieron cargar los productos.');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  if (cargando) return <Spinner texto="Cargando productos..." />;
  if (error) return <p className="catalogo-estado catalogo-error">{error}</p>;

  const productosFiltrados = categoriaFiltro
    ? productos.filter((p) => p.categoria === categoriaFiltro)
    : productos;

  const titulo = categoriaFiltro
    ? categoriaFiltro.charAt(0).toUpperCase() + categoriaFiltro.slice(1)
    : 'Catálogo';

  return (
    <main className="catalogo">
      <div className="catalogo-header">
        <h1>{titulo}</h1>
        <p>{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}</p>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="catalogo-estado">No hay productos disponibles.</p>
      ) : (
        <div className="catalogo-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </div>
      )}
    </main>
  );
}

export default CatalogPage;
