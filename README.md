# Sabina Accesorios — E-commerce

Tienda online de accesorios para mujer (anillos, aros, collares y carteras). Trabajo Práctico Integrador para la materia **Programación IV** — TUP UTN FRCU 2026.

Stack: **MERN** (MongoDB Atlas, Express, React/Vite, Node.js)

---

## Requisitos previos

- Node.js v18 o superior
- npm
- Cuenta en MongoDB Atlas (o URI de conexión provista por el equipo)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/lucasperinotto/ecommerce-university-project.git
cd ecommerce-university-project
```

### 2. Configurar variables de entorno del backend

Crear un archivo `.env` en la **raíz del proyecto** (junto a `package.json`):

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/sabina-accesorios
JWT_SECRET=sabina2026secreto
```

### 3. Configurar variables de entorno del frontend

Crear un archivo `.env` dentro de la carpeta `client/`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Instalar dependencias del backend

```bash
npm install
```

### 5. Instalar dependencias del frontend

```bash
cd client
npm install
cd ..
```

### 6. Cargar productos de prueba (primera vez)

```bash
node src/seed.js
```

Carga los 17 productos del archivo `src/data/productos.data.json`. Si ya hay productos en la base de datos, no duplica.

### 7. Ejecutar el backend

Desde la raíz del proyecto:

```bash
npm start
```

El servidor queda corriendo en `http://localhost:3000`.

### 8. Ejecutar el frontend

Desde la carpeta `client/`:

```bash
cd client
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Estructura del proyecto

```
ecommerce-university-project/
├── client/                         # Frontend (React + Vite)
│   ├── public/images/              # Imágenes de productos y logo
│   └── src/
│       ├── components/             # Navbar, Footer, ProductCard, ModalConfirm
│       │   ├── PrivateRoute.jsx    # Protege rutas que requieren login
│       │   └── AdminRoute.jsx      # Protege rutas de administrador
│       ├── context/
│       │   ├── AuthContext.jsx     # Autenticación JWT + localStorage
│       │   └── CarritoContext.jsx  # Carrito en localStorage
│       ├── pages/
│       │   ├── admin/              # AdminProductsPage, AdminUsersPage, AdminOrdersPage
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── CatalogPage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── OrdersPage.jsx
│       │   └── OrderDetailPage.jsx
│       └── services/               # authService, productosService, usuariosService, ordenesService
├── src/                            # Backend (Node.js + Express)
│   ├── controllers/
│   ├── data/productos.data.json    # Datos iniciales para seed
│   ├── models/                     # Producto, Usuario, Orden, Carrito
│   ├── routes/
│   ├── seed.js                     # Script de carga inicial
│   ├── app.js
│   ├── db.js
│   └── server.js
├── .env                            # Variables de entorno (no incluido en Git)
└── README.md
```

---

## Endpoints de la API

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productos` | Obtiene todos los productos |
| GET | `/productos/:id` | Obtiene un producto por ID |
| POST | `/productos` | Crea un nuevo producto |
| PUT | `/productos/:id` | Actualiza un producto |
| DELETE | `/productos/:id` | Baja lógica (estado → inactivo) |
| PATCH | `/productos/:id/stock` | Ajusta el stock (`{ delta: number }`) |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios` | Obtiene todos los usuarios |
| GET | `/usuarios/:id` | Obtiene un usuario por ID |
| POST | `/usuarios` | Registra un nuevo usuario |
| PUT | `/usuarios/:id` | Actualiza un usuario |
| DELETE | `/usuarios/:id` | Baja lógica (estado → inactivo) |

### Órdenes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/ordenes` | Obtiene todas las órdenes |
| GET | `/ordenes/:id` | Obtiene órdenes de un usuario |
| POST | `/ordenes` | Crea una nueva orden |

### Auth *(pendiente de implementación)*

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar usuario con JWT |
| POST | `/auth/login` | Login — devuelve token JWT |
| POST | `/auth/forgot-password` | Solicitar recuperación de contraseña |
| POST | `/auth/reset-password` | Resetear contraseña con token |

---

## Rutas del frontend

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Home |
| `/catalogo` | Público | Catálogo (filtra por `?categoria=`) |
| `/producto/:id` | Público | Detalle de producto |
| `/carrito` | Público | Carrito de compras |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro de usuario |
| `/recuperar-contrasena` | Público | Recuperar contraseña |
| `/restablecer-contrasena/:token` | Público | Resetear contraseña |
| `/checkout` | Requiere login | Confirmar orden |
| `/perfil` | Requiere login | Perfil del usuario |
| `/mis-ordenes` | Requiere login | Historial de órdenes |
| `/mis-ordenes/:id` | Requiere login | Detalle de orden |
| `/admin/productos` | Admin | ABM de productos |
| `/admin/usuarios` | Admin | ABM de usuarios |
| `/admin/ordenes` | Admin | Listado de órdenes |
