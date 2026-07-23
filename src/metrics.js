// src/metrics.js
// Métricas en formato Prometheus para observabilidad.
// El backend expone estas métricas en /metrics; Prometheus las raspa y Grafana
// las muestra en un tablero.
import client from 'prom-client';

const register = new client.Registry();
register.setDefaultLabels({ app: 'gestor-de-tareas' });

// Métricas por defecto del proceso Node (memoria, CPU, event loop, etc.).
client.collectDefaultMetrics({ register });

// Duración de las peticiones HTTP, por método, ruta y código de estado.
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

// Total de peticiones HTTP atendidas.
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP atendidas',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestsTotal);

// Middleware que mide cada petición y la registra al terminar la respuesta.
export function metricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    // Se usa el patrón de la ruta (p. ej. /tareas/:id) para no explotar la
    // cardinalidad con cada id distinto.
    const route = req.route?.path || req.path || 'unknown';
    const labels = { method: req.method, route, status_code: res.statusCode };
    end(labels);
    httpRequestsTotal.inc(labels);
  });
  next();
}

export { register };
