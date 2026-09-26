export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing audio URL parameter', { status: 400 });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return new Response('Invalid URL', { status: 400 });
    }

    // Only allow audio from equran.id or trusted sources
    if (!parsedUrl.hostname.includes('equran.id')) {
      return new Response('Forbidden host', { status: 403 });
    }

    // Forward range header if present for audio scrubbing/seeking
    const headers = {};
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      headers['range'] = rangeHeader;
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    const responseHeaders = new Headers();
    // Enable full CORS for Web Audio API / Tone.js
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range, Accept-Encoding');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
    responseHeaders.set('Content-Type', upstreamResponse.headers.get('content-type') || 'audio/mpeg');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, immutable');

    if (upstreamResponse.headers.has('content-range')) {
      responseHeaders.set('Content-Range', upstreamResponse.headers.get('content-range'));
    }
    if (upstreamResponse.headers.has('content-length')) {
      responseHeaders.set('Content-Length', upstreamResponse.headers.get('content-length'));
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Audio proxy error:', error);
    return new Response('Failed to fetch audio stream', { status: 500 });
  }
}

export async function HEAD(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return new Response(null, { status: 400 });
    }

    const parsedUrl = new URL(targetUrl);
    if (!parsedUrl.hostname.includes('equran.id')) {
      return new Response(null, { status: 403 });
    }

    const upstreamResponse = await fetch(targetUrl, { method: 'HEAD' });

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range, Accept-Encoding');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
    responseHeaders.set('Content-Type', upstreamResponse.headers.get('content-type') || 'audio/mpeg');
    responseHeaders.set('Accept-Ranges', 'bytes');
    if (upstreamResponse.headers.has('content-length')) {
      responseHeaders.set('Content-Length', upstreamResponse.headers.get('content-length'));
    }

    return new Response(null, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Accept-Encoding',
      'Access-Control-Max-Age': '86400',
    },
  });
}
