
const CACHE_NAME = "scan-car-v1";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./vehiculo.html",
  "./diagnostico.html",
  "./resultado.html",
  "./historial.html",
  "./mantenimiento.html",
  "./estilos.css",
  "./manifest.json",
  "./icon-car.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) => {
      return Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const guardado = await caches.match(event.request);

      if (guardado) return guardado;

      if (event.request.mode === "navigate") {
        return caches.match("./index.html");
      }

      return new Response("No hay conexión a internet.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    })
  );
});
