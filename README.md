# Sabina Accesorios — E-commerce

Aplicación web de e-commerce para la venta de accesorios (anillos, aros, collares y carteras). Desarrollada con React en el frontend y Node.js + Express en el backend, con base de datos MongoDB Atlas.

---

## Tecnologías utilizadas

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB Atlas (Mongoose)
- **Control de versiones:** Git / GitHub

---

## Requisitos previos

- Node.js instalado (v18 o superior)
- npm instalado
- Conexión a internet (para MongoDB Atlas)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/lucasperinotto/ecommerce-university-project.git
cd ecommerce-university-project
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd client
npm install
cd ..
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/?appName=SabinaAccesorios
PORT=3000
```

### 5. Ejecutar el backend

Desde la raíz del proyecto:

```bash
npm run dev
```

El servidor quedará corriendo en `http://localhost:3000`.

### 6. Ejecutar el frontend

Desde la carpeta `client`:

```bash
cd client
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

---

## Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productos` | Obtiene todos los productos |
| GET | `/productos/:id` | Obtiene un producto por ID |
| POST | `/productos` | Crea un nuevo producto |
| PUT | `/productos/:id` | Actualiza un producto |
| DELETE | `/productos/:id` | Baja lógica de un producto |
| GET | `/usuarios` | Obtiene todos los usuarios |
| POST | `/usuarios` | Crea un nuevo usuario |
| GET | `/carrito` | Obtiene el carrito |
| POST | `/carrito` | Agrega un producto al carrito |
| GET | `/ordenes` | Obtiene todas las órdenes |
| POST | `/ordenes` | Crea una nueva orden |

---

## Estructura del proyecto

```
ecommerce-university-project/
├── client/                 # Frontend (React + Vite)
│   ├── public/             # Imágenes de productos
│   └── src/
│       ├── components/     # Componentes reutilizables
│       ├── pages/          # Páginas principales
│       └── services/       # Llamadas a la API
├── src/                    # Backend (Node.js + Express)
│   ├── controllers/        # Lógica de cada endpoint
│   ├── data/               # Datos en JSON (respaldo)
│   ├── models/             # Modelos de Mongoose
│   └── routes/             # Definición de rutas
└── README.md
```
