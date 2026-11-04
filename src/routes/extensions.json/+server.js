export const prerender = true;

import extensions from '$lib/extensions.js';

export async function GET() {
  return new Response(JSON.stringify(extensions, null, 4), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
