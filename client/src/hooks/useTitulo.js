import { useEffect } from 'react';

function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `Sabina Accesorios - ${titulo}` : 'Sabina Accesorios';
  }, [titulo]);
}

export default useTitulo;
