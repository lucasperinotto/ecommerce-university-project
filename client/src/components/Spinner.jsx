function Spinner({ texto = 'Cargando...', pequeño = false }) {
  return (
    <div className={`spinner-wrap${pequeño ? ' spinner-wrap--small' : ''}`}>
      <div className={`spinner${pequeño ? ' spinner--small' : ''}`} />
      {texto && <p className="spinner-texto">{texto}</p>}
    </div>
  );
}

export default Spinner;
