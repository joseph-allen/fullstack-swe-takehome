import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/helpers/apiHelpers';

const BACKEND_URL = 'http://backend:4000/parties';
const ALLOWED_STATUSES = ['waiting', 'seated', 'done'];

// Fetch a party, optionally filter by allowed statuses
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status');

  // if status is in params, and allowed
  if (status && !ALLOWED_STATUSES.includes(status)) {
    return jsonError(
      `Invalid status: must be one of ${ALLOWED_STATUSES.join(', ')}`,
      400
    );
  }

  try {
    const url = new URL(BACKEND_URL);
    if (status) url.searchParams.set('status', status);

    const res = await fetch(url.toString());
    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/parties error:', error);
    return jsonError('Failed to fetch parties', 500);
  }
}

// POST to create a new party
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/parties error:', error);
    return jsonError(
      error instanceof Error ? error.message : 'Failed to create party',
      500
    );
  }
}
