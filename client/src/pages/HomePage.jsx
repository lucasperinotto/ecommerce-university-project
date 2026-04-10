import { Link } from 'react-router-dom';
import './HomePage.css';

const categorias = [
  { nombre: 'Anillos', categoria: 'ANILLOS', imagen: '/ANILLOS (1).jpg', position: 'center 60%' },
  { nombre: 'Aros',    categoria: 'AROS',    imagen: '/AROS (1).jpg' },
  { nombre: 'Collares', categoria: 'COLLARES', imagen: '/COLLAR (2).jpg' },
  { nombre: 'Carteras', categoria: 'CARTERAS', imagen: '/MINIBAG (6).jpeg', position: 'center 40%' },
];

function HomePage() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-subtitulo">Nueva colección 2026</p>
          <h1 className="hero-titulo">Accesorios que<br />acompañan tu look</h1>
          <Link to="/catalogo" className="hero-btn">Ver catálogo</Link>
        </div>
        <div className="hero-imagen-wrap">
          <img src="/PORTADA (1).jpeg" alt="Sabina Accesorios" className="hero-imagen" />
        </div>
      </section>

      <section className="categorias">
        <h2 className="categorias-titulo">Explorá por categoría</h2>
        <div className="categorias-grid">
          {categorias.map((cat) => (
            <Link to={`/catalogo?categoria=${cat.categoria}`} key={cat.nombre} className="categoria-card">
              {cat.imagen ? (
                <img src={cat.imagen} alt={cat.nombre} className="categoria-img" style={cat.position ? { objectPosition: cat.position } : undefined} />
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
