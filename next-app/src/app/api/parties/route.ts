import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_STATUSES = ['waiting', 'seated', 'done'];

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status');

    // Validate the status if provided
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status: must be one of ${ALLOWED_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const url = new URL('http://backend:4000/parties');
    if (status) {
      url.searchParams.set('status', status);
    }

    const res = await fetch(url.toString());
    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error proxying GET /parties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch('http://backend:4000/parties', {
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
    console.error('Error proxying PATCH /parties:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update party',
      },
      { status: 500 }
    );
  }
}
