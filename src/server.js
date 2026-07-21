import app from './app.js';

const PORT = process.env.PORT || 3001;

// Red de seguridad para el despliegue: un error asíncrono no capturado no debe
// tumbar el servidor. Se registra y el proceso sigue vivo para responder /health.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

// SIMULACRO DE CAOS (Sesión 7): fallo de arranque intencional para practicar el
// rollback. Solo se dispara cuando hay base de datos real (Railway), así que pasa
// el quality gate local (pruebas y E2E corren sin DATABASE_URL) pero rompe el
// arranque en staging. Se revierte en la Ronda 3.
if (process.env.DATABASE_URL) {
  throw new Error('fallo simulado para el simulacro de caos');
}

// Escuchar en 0.0.0.0 para que el healthcheck del orquestador (Railway) alcance
// el servicio dentro del contenedor.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API de tareas escuchando en el puerto ${PORT}`);
});
