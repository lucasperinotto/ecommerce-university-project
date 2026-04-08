const imagenesPorCategoria = {
  COLLARES: '/COLLAR (1).jpg',
  ANILLOS:  '/ANILLOS (1).jpg',
  AROS:     '/AROS (1).jpg',
  CARTERAS: null,
};

export function getImagenCategoria(categoria) {
  return imagenesPorCategoria[categoria] ?? null;
}
