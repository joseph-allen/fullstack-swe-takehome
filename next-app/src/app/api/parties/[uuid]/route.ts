import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/helpers/apiHelpers';

const BACKEND_URL = 'http://backend:4000/parties';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const params = await context.params;
  const uuid = params.uuid;

  // if client didn't send a uuid, but somehow got here
  if (!uuid) {
    return jsonError('No params provided', 400);
  }

  try {
    // make GET call
    const res = await fetch(`${BACKEND_URL}/${uuid}`);

    if (!res.ok) {
      return jsonError('Party not found', 404);
    }

    const party = await res.json();
    return NextResponse.json(party);
  } catch (error) {
    console.error('GET /parties/:uuid error:', error);
    return jsonError('Server error', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ uuid: string }> }
) {
  const params = await context.params;
  const uuid = params.uuid;

  if (!uuid) {
    return jsonError('UUID is required', 400);
  }

  try {
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/${uuid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log('PATCH response from backend:', res.status, text);

    if (!res.ok) {
      return jsonError('Failed to update party', res.status);
    }

    const data = JSON.parse(text);

    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PATCH /parties/:uuid error:', error);
    return jsonError('Failed to update party', 500);
  }
}
