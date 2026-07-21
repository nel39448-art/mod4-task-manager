import app from './app.js';

const PORT = process.env.PORT || 3001;

// Red de seguridad para el despliegue: un error asíncrono no capturado no debe
// tumbar el servidor. Se registra y el proceso sigue vivo para responder /health.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

// Escuchar en 0.0.0.0 para que el healthcheck del orquestador (Railway) alcance
// el servicio dentro del contenedor.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API de tareas escuchando en el puerto ${PORT}`);
});
