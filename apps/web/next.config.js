/** @type {import('next').NextConfig} */
// De Reason3n-demo is volledig frontend-only (alle routes zijn statisch,
// dashboard/ledger/proposals draaien op mock-data, login heeft een demo-
// fallback). Daarom exporteren we naar statische bestanden ('output: export')
// zodat elke webserver (bv. Caddy) het met TLS kan serveren -- geen Node-
// runtime nodig. Zet dit om naar 'standalone' zodra er een echte backend
// (apps/api) meedraait die server-side routes vereist.
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // vereist voor static export
  trailingSlash: true,           // /dashboard/ -> /dashboard/index.html, simpel statisch te serveren
};

module.exports = nextConfig;
