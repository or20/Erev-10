const CACHE_NAME = "erev-10-pwa-v14";

const ASSETS = [
  "./",
  "./index.html",
  "./join.html",
  "./signup.html",
  "./client-v3.html",
  "./manager.html",
  "./courier.html",
  "./bakery.html",
  "./styles.css",
  "./supabase-config.js",
  "./install-fix.js",
  "./manifest.webmanifest",
  "./manifest-manager.webmanifest",
  "./manifest-customer.webmanifest",
  "./manifest-courier.webmanifest",
  "./manifest-bakery.webmanifest",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function injectInstallFix(response) {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  const html = await response.text();
  if (html.includes("install-fix.js")) {
    return new Response(html, {status: response.status, statusText: response.statusText, headers: response.headers});
  }

  const fixed = html.replace("</body>", '<script src="./install-fix.js?v=14"></script></body>');
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(fixed, {status: response.status, statusText: response.statusText, headers});
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(async response => {
        if (!response || !response.ok) return response;
        const finalResponse = event.request.destination === "document" ? await injectInstallFix(response) : response;
        const copy = finalResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return finalResponse;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match("./join.html")))
  );
});