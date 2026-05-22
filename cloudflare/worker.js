/**
 * Cloudflare Worker: adds security headers (including HSTS) for techgroupkenya.co.ke.
 * Deploy: npx wrangler deploy (from repo root; requires Cloudflare API token).
 * Alternative: Cloudflare Dashboard → SSL/TLS → Edge Certificates → Enable HSTS.
 */
export default {
  async fetch(request) {
    const response = await fetch(request);
    const headers = new Headers(response.headers);

    headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
