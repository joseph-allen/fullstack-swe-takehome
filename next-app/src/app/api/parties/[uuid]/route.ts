import { NextRequest, NextResponse } from 'next/server';

// @ts-expect-error TypeScript’s strict route handler typing expects the second parameter to be a Promise-like type
export async function GET(req: NextRequest, context): Promise<NextResponse> {
  const { uuid } = context.params;

  if (!uuid) {
    return NextResponse.json({ error: 'No params provided' }, { status: 400 });
  }

  try {
    const res = await fetch(`http://backend:4000/parties/${uuid}`);

    if (!res.ok) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }

    const party = await res.json();
    return NextResponse.json(party);
  } catch (error) {
    console.error('Error proxying GET /parties:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// @ts-expect-error TypeScript’s strict route handler typing expects the second parameter to be a Promise-like type
export async function PATCH(req: NextRequest, context): Promise<NextResponse> {
  try {
    const { params } = context;

    if (!params || !params.uuid) {
      return NextResponse.json({ error: 'UUID is required' }, { status: 400 });
    }

    const { uuid } = params;

    const body = await req.json();

    const res = await fetch(`http://backend:4000/parties/${uuid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log('PATCH response from backend:', res.status, text);

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to update party' },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);

    return NextResponse.json(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error proxying PATCH /parties:', error);
    return NextResponse.json(
      { error: 'Failed to update party' },
      { status: 500 }
    );
  }
}
