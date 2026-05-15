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

### 4. Configurar variables de entorno del backend

Crear un archivo `.env` en la **raíz del proyecto** (junto a `package.json`) con el siguiente contenido:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/?appName=<nombreDelProyecto>
PORT=3000
```

> El archivo `.env` está ignorado por Git para proteger las credenciales. Sin él, el servidor no podrá conectarse a la base de datos.

### 5. Configurar variables de entorno del frontend

El frontend también necesita su propio archivo `.env` para saber a qué URL apuntar cuando realiza las llamadas a la API. Crear un archivo `.env` dentro de la carpeta `client/` con el siguiente contenido:

```env
VITE_API_URL=http://localhost:3000
```

> Este archivo es obligatorio para que el frontend pueda comunicarse con el backend. Sin él, todas las peticiones a la API fallarán. El prefijo `VITE_` es requerido por Vite para exponer la variable al código React.

### 6. Ejecutar el backend

Desde la raíz del proyecto:

```bash
npm run dev
```

El servidor quedará corriendo en `http://localhost:3000`.

### 7. Ejecutar el frontend

Desde la carpeta `client`:

```bash
cd client
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

---

## Estructura del proyecto

```
ecommerce-university-project/
├── client/                 # Frontend (React + Vite)
│   ├── public/  
│       └── images/         # Imágenes de productos
│   └── src/
│       ├── components/     # Componentes reutilizables de una página
│       ├── pages/          # Páginas principales
│       ├── services/       # Llamadas a la API
│       ├── utils/          # Funciones reutilizables
│       ├── app.jsx         # Archivo que arranca la app
│       └── main.jsx        # Archivo que define el funcionamiento de la app
├── src/                    # Backend (Node.js + Express)
│   ├── controllers/        # Lógica de cada endpoint
│   ├── data/               # Datos en JSON (respaldo)
│   ├── models/             # Modelos de Mongoose
│   ├── routes/             # Definición de rutas 
│   ├── app.js              # Archivo que configura la aplicación
│   ├── db.js               # Archivo que arranca el servidor y establece la conexión con la base de datos
│   └── server.js           # Archivo que conecta la aplicación con MongoDB
└── README.md
```

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
| GET | `/usuarios/:id` | Obtiene un usuario por ID |
| POST | `/usuarios` | Registra un nuevo usuario |
| PUT | `/usuarios/:id` | Actualiza un usuario |
| DELETE | `/usuarios/:id` | Baja lógica de un usuario |
| GET | `/carrito` | Obtiene todos los carritos |
| GET | `/carrito/:id` | Obtiene el carrito de un usuario |
| POST | `/carrito/:id` | Crea un carrito para un usuario |
| POST | `/carrito/:id/items` | Agrega un producto al carrito |
| GET | `/ordenes` | Obtiene todas las órdenes |
| GET | `/ordenes/:id` | Obtiene las órdenes de un usuario |
| POST | `/ordenes` | Crea una nueva orden |
