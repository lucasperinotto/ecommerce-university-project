const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const app = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        console.log('Arrancando server...');
        await connectDB();
        app.listen(PORT, () => {
            console.log(`El server se está ejecutando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos. ", error);
        process.exit(1);
    }
})();