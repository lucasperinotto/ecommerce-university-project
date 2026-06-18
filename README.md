# Sabina Accesorios — E-commerce

Tienda online de accesorios para mujer (anillos, aros, collares y carteras). Trabajo Práctico Integrador para la materia **Programación IV** — TUP UTN FRCU 2026.

Stack: **MERN** (MongoDB Atlas, Express, React/Vite, Node.js)

---

## Requisitos previos

- Node.js v18 o superior
- npm
- Cuenta en MongoDB Atlas (o URI de conexión provista por el equipo)
- Cuenta de Gmail con contraseña de aplicación (para el envío de mails de recuperación de contraseña)

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
FRONTEND_URL=http://localhost:5173

# Envío de mails (recuperación de contraseña)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<tu-email>@gmail.com
SMTP_PASS=<contraseña de aplicación de Gmail, no la contraseña normal de la cuenta>
MAIL_FROM=<tu-email>@gmail.com
```

> **Importante**: la `MONGO_URI` debe incluir el nombre de la base de datos (`/sabina-accesorios`). Si se omite, Mongo se conecta por defecto a una base llamada `test`, vacía.

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
│   ├── public/images/              # Imágenes de productos y logo/favicon
│   └── src/
│       ├── components/             # Navbar, Footer, ProductCard, ModalConfirm, Spinner
│       │   ├── PrivateRoute.jsx    # Protege rutas que requieren login
│       │   └── AdminRoute.jsx      # Protege rutas de administrador
│       ├── context/
│       │   ├── AuthContext.jsx     # Autenticación JWT + localStorage
│       │   ├── CarritoContext.jsx  # Carrito en localStorage
│       │   └── ToastContext.jsx    # Notificaciones (toasts)
│       ├── hooks/
│       │   └── useTitulo.js        # Título dinámico de la pestaña por página
│       ├── pages/
│       │   ├── admin/              # AdminProductsPage, AdminUsersPage, AdminOrdersPage
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── ForgotPasswordPage.jsx
│       │   ├── ResetPasswordPage.jsx
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
│   ├── middlewares/
│   │   └── auth.middleware.js      # authMiddleware (JWT), adminMiddleware (rol), isOwnerOrAdmin
│   ├── models/                     # Producto, Usuario, Orden, Carrito
│   ├── routes/
│   ├── mailer.js                   # Envío de mails (nodemailer)
│   ├── seed.js                     # Script de carga inicial
│   ├── app.js
│   ├── db.js
│   └── server.js
├── .env                            # Variables de entorno (no incluido en Git)
└── README.md
```

---

## Autenticación y roles

La API usa **JWT**. Los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene en `POST /auth/login` o `POST /usuarios` (registro), y expira a la hora.

Roles soportados: `cliente` (default) y `admin`. Las rutas marcadas como **Admin** además del login válido requieren que `usuario.rol === 'admin'`.

---

## Endpoints de la API

### Auth (`/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/forgot-password` | Solicitar recuperación de contraseña | No |
| POST | `/auth/reset-password/:token` | Restablecer contraseña | No |

**POST `/auth/login`**
Body: `{ "mail": "string", "contrasena": "string" }`
Respuesta `200`: usuario logueado: `{ "token": "jwt", "usuario": { "_id", "nombre", "apellido", "mail", "rol", "estado", ... } }`
Errores: `400`: campos faltantes · `401`: usuario no encontrado / inactivo / credenciales inválidas

**POST `/auth/forgot-password`**
Body: `{ "mail": "string" }`
Respuesta `200`: se envía mail de recuperación de contraseña: `{ "mensaje": "Se enviará un enlace de recuperación al correo electrónico ingresado." }` (mismo mensaje exista o no el mail, por seguridad)
Errores: `400`: campos faltantes

**POST `/auth/reset-password/:token`**
Body: `{ "nuevaContrasena": "string", "confirmar": "string" }`
Respuesta `201`: usuario actualizado
Errores: `400`: contraseñas no coinciden / menor a 6 caracteres · `400` token inválido o expirado

---

### Productos (`/productos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/productos` | Obtener Productos | No |
| GET | `/productos/:id` | Obtener Producto por ID | No |
| POST | `/productos` | Crear Producto | Admin |
| PUT | `/productos/:id` | Actualizar Producto | Admin |
| DELETE | `/productos/:id` | Baja Lógica de Producto | Admin |
| PATCH | `/productos/:id/restore` | Restaurar Producto | Admin |
| PATCH | `/productos/:id/stock` | Ajustar Stock | No* |

**GET `/productos`**
Respuesta: `200`: array de productos

**GET `/productos/:id`**
Respuesta: `200`: producto
Errores: `404`: producto no encontrado

**POST `/productos`**
Body: `{ "nombre", "descripcion", "precio": number, "cantidad": number, "imagen": "url", "categoria": "anillos"|"aros"|"collares"|"carteras" }`
Respuesta: `201`: producto creado
Errores: `404`: campos faltantes / ingresos no válidos

**PUT `/productos/:id`**
Body: Body: `{ "nombre", "descripcion", "precio": number, "cantidad": number, "imagen": "url", "categoria": "anillos"|"aros"|"collares"|"carteras" }`
Respuesta: `200`: producto actualizado
Errores: `404`: producto no encontrado / campos faltantes / ingresos no válidos

**DELETE `/productos/:id`**
Respuesta: `200`: baja lógica del producto (`estado: "inactivo"`)
Errores: `404`: producto no encontrado

**PATCH `/productos/:id/restore`**
Respuesta: `200`: alta lógica de un producto inactivo (`estado: "activo"`)
Errores: `404`: producto no encontrado

**PATCH `/productos/:id/stock`**
Body: `{ "delta": number }` (positivo suma stock, negativo resta)
Respuesta: `200`: producto con `cantidad` actualizada
Errores: `400`: ingreso no válido / stock insuficiente · `404`: producto no encontrado

---

### Usuarios (`/usuarios`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/usuarios` | Obtener Usuarios | Admin |
| GET | `/usuarios/:id` | Obtener Usuario por ID | Logueado |
| POST | `/usuarios` | Crear Usuario | No |
| PUT | `/usuarios/:id` | Actualizar Usuario | Logueado |
| PATCH | `/usuarios/:id/address` | Agregar Dirección | Logueado |
| DELETE | `/usuarios/:id` | Baja Lógica de Usuario | Admin |
| PATCH | `/usuarios/:id/restore` | Restaurar Usuario | Logueado |

**GET `/usuarios`**
Respuesta: `200`: array de usuarios

**GET `/usuarios/:id`**
Respuesta: `200`: usuario · `404`: no encontrado

**POST `/usuarios`**
Body: `{ "nombre", "apellido", "mail", "contrasena", "confirmar", "rol" }`
Respuesta: `201`: nuevo usuario `{ "token": "jwt", "usuarioResponse": { ...usuario sin contraseña } }`
Errores: `400`: campos faltantes / mail inválido / contraseña menor a seis caracteres o no coincide · `401`: mail ya registrado y activo

**PUT `/usuarios/:id`**
Body: `{ "nombre", "apellido" }`
Respuesta: `200`: usuario actualizado
Errores: `400`: campos faltantes · `403`: no autorizado · `404`: usuario no encontrado

**PATCH `/usuarios/:id/address`**
Body: `{ "direcciones": [{ "calle", "numero", "ciudad", "provincia", "codigoPostal" }] }`
Respuesta: `200`: usuario con domicilios actualizados
Errores: `403`: no autorizado · `404`: usuario no encontrado

**DELETE `/usuarios/:id`**
Respuesta: `200`: baja lógica del usuario (`estado: "inactivo"`)
Errores: `404`: usuario no encontrado

**PATCH `/usuarios/:id/restore`**
Respuesta: `200`: alta lógica del usuario (`estado: "activo"`)
Errores: `404`: usuario no encontrado

---

### Carrito (`/carrito`)

> El **frontend no usa estos endpoints**: el carrito de compras se maneja 100% en `localStorage` del navegador. Estos endpoints existen en el backend para cumplir con el requisito de gestión de carrito.

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/carrito` | Obtener Carritos | Admin |
| GET | `/carrito/:id` | Obtener Carrito por ID | Dueño o admin |
| POST | `/carrito/:id` | Crear Carrito | Dueño o admin |
| POST | `/carrito/:id/items` | Agregar Producto al Carrito | Dueño o admin |
| PUT | `/carrito/:id/items/:idProducto` | Modificar Cantidad de un Producto en el Carrito | Dueño o admin |
| DELETE | `/carrito/:id/items/:idProducto` | Eliminar Producto del Carrito | Dueño o admin |
| DELETE | `/carrito/:id/items` | Vaciar Carrito | Dueño o admin |

`:id` es el `idUsuario` dueño del carrito (no el id del carrito).

**GET `/carrito`**
Respuesta: `200`: array de carritos

**GET `/carrito/:id`**
Respuesta: `200`: carrito · `404`: no encontrado

**POST `/carrito/:id`**
Respuesta: `201`: nuevo carrito `{ "idUsuario", "items": [] }`
Errores: `400`: carrito ya existente

**POST `/carrito/:id/items`**
Body: `{ "idProducto", "nombre", "precio": number, "cantidad": number }`
Respuesta: `201`: carrito actualizado (si el producto ya existía en el carrito, suma la cantidad)
Errores: `400`: campos faltantes / ingresos no válidos / carrito no encontrado

**PUT `/carrito/:id/items/:idProducto`**
Body: `{ "cantidad": number }`
Respuesta: `200`: carrito actualizado
Errores: `404`: ingreso no válido / carrito no encontrado / producto no está en el carrito

**DELETE `/carrito/:id/items/:idProducto`** 
Respuesta: `200`: carrito sin ese ítem
Errores: `404`: carrito no encontrado / producto no está en el carrito

**DELETE `/carrito/:id/items`** 
Respuesta: `200`: carrito con `items: []`
Errores: `404`: carrito no encontrado

---

### Órdenes (`/ordenes`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/ordenes` | Obtener Ordenes | Admin |
| GET | `/ordenes/usuario/:id` | Obtener Ordenes de un Usuario | Dueño o admin |
| POST | `/ordenes` | Generar Orden | Logueado |

**GET `/ordenes`** 
Respuesta: `200`: array de todas las órdenes

**GET `/ordenes/usuario/:id`** 
Respuesta: `200`: array de órdenes del usuario `:id`

**POST `/ordenes`**
Body:
```json
{
  "idUsuario": "string",
  "items": [{ "idProducto", "nombre", "precio": number, "cantidad": number }],
  "precioTotal": number,
  "metodoPago": "efectivo" | "transferencia" | "tarjeta" | "paypal",
  "tipoEntrega": "retiro" | "envio",
  "direccionEnvio": { "calle", "numero", "ciudad", "provincia", "codigoPostal" }
}
```
`direccionEnvio` es obligatorio solo si `tipoEntrega === "envio"`.
Respuesta `201`: orden creada con `estado: "pendiente de pago"`. El stock se descuenta desde el frontend al confirmar (`PATCH /productos/:id/stock`).
Errores: `400`: campos faltantes / ingresos no válidos / producto no disponible / sin stock · `404`: usuario no encontrado

---

## Rutas del frontend

| Ruta | Auth | Descripción |
|------|------|-------------|
| `/` | Público | Home |
| `/catalogo` | Público | Catálogo (filtra por `?categoria=`) |
| `/producto/:id` | Público | Detalle de producto |
| `/carrito` | Público | Carrito de compras |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Registro de usuario |
| `/recuperar-contrasena` | Público | Recuperar contraseña |
| `/restablecer-contrasena/:token` | Público | Resetear contraseña |
| `/checkout` | Requiere login | Confirmar orden |
| `/perfil` | Requiere login | Perfil del usuario y domicilios guardados |
| `/mis-ordenes` | Requiere login | Historial de órdenes |
| `/mis-ordenes/:id` | Requiere login | Detalle de orden |
| `/admin/productos` | Admin | ABM de productos |
| `/admin/usuarios` | Admin | ABM de usuarios |
| `/admin/ordenes` | Admin | Listado de órdenes |
