import { NextResponse } from 'next/server';

const videoId = '12S9lMxww4VVE4welFqDN01xeLQTRrIqy';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'El video no está configurado.' }, { status: 503 });
  }

  const range = request.headers.get('range');
  const mediaUrl = new URL(`https://www.googleapis.com/drive/v3/files/${videoId}`);
  mediaUrl.searchParams.set('alt', 'media');
  mediaUrl.searchParams.set('key', apiKey);

  const response = await fetch(mediaUrl, {
    headers: range ? { Range: range } : undefined,
    cache: 'no-store'
  });

  if (!response.ok && response.status !== 206) {
    return NextResponse.json({ error: 'No fue posible cargar el video.' }, { status: 502 });
  }

  const headers = new Headers();
  for (const header of ['accept-ranges', 'content-length', 'content-range', 'content-type']) {
    const value = response.headers.get(header);
    if (value) headers.set(header, value);
  }
  headers.set('Cache-Control', 'public, max-age=3600');

  return new NextResponse(response.body, {
    status: response.status,
    headers
  });
}
