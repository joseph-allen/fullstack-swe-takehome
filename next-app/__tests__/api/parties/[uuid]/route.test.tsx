import { PATCH } from '@/app/api/parties/[uuid]/route';
import { NextResponse } from 'next/server';

// mock json response calls
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('PATCH handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Creates a fake request object with a .json() method
  const mockRequest = (body: any) => ({
    json: jest.fn().mockResolvedValue(body),
  });

  it('returns 400 if uuid param is missing', async () => {
    const req = mockRequest({ newStatus: 'seated' });

    const res = await PATCH(req as any, { params: { uuid: '' } });

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'UUID is required' },
      { status: 400 }
    );
  });

  it('forwards PATCH request and returns backend response', async () => {
    const reqBody = { newStatus: 'seated' };
    const req = mockRequest(reqBody);
    const params = { uuid: 'abc123' };

    // simulate successful http response
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: jest
        .fn()
        .mockResolvedValue(
          JSON.stringify({ message: 'Party updated', status: 'seated' })
        ),
    });

    await PATCH(req as any, { params });

    expect(global.fetch).toHaveBeenCalledWith(
      `http://backend:4000/parties/${params.uuid}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      }
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: 'Party updated', status: 'seated' },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  });

  it('returns 500 and logs error on fetch failure', async () => {
    const req = mockRequest({ newStatus: 'seated' });
    const params = { uuid: 'abc123' };

    global.fetch = jest.fn().mockRejectedValue(new Error('Network failure'));

    // supress console errors during tests
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await PATCH(req as any, { params });

    // catch expected console error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'PATCH /parties/:uuid error:',
      expect.any(Error)
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to update party' },
      { status: 500 }
    );

    consoleErrorSpy.mockRestore();
  });
});
