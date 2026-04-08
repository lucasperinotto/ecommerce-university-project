import { Link } from 'react-router-dom';
import './HomePage.css';

const categorias = [
  { nombre: 'Anillos', imagen: '/ANILLOS (1).jpg' },
  { nombre: 'Aros',    imagen: '/AROS (1).jpg' },
  { nombre: 'Collares', imagen: '/COLLAR (2).jpg' },
  { nombre: 'Carteras', imagen: null },
];

function HomePage() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitulo">Nueva colección 2026</p>
          <h1 className="hero-titulo">Accesorios que<br />te definen</h1>
          <p className="hero-descripcion">
            Anillos, aros, collares y carteras artesanales para cada momento.
          </p>
          <Link to="/catalogo" className="hero-btn">Ver catálogo</Link>
        </div>
        <div className="hero-imagen-wrap">
          <img src="/COLLAR (2).jpg" alt="Collar de sol dorado" className="hero-imagen" />
        </div>
      </section>

      <section className="categorias">
        <h2 className="categorias-titulo">Explorá por categoría</h2>
        <div className="categorias-grid">
          {categorias.map((cat) => (
            <Link to="/catalogo" key={cat.nombre} className="categoria-card">
              {cat.imagen ? (
                <img src={cat.imagen} alt={cat.nombre} className="categoria-img" />
              ) : (
                <div className="categoria-img-placeholder" />
              )}
              <span>{cat.nombre}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
