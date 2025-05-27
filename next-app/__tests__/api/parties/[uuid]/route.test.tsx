import { PATCH } from '@/app/api/parties/[uuid]/route';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('PATCH handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRequest = (body) => ({
    json: jest.fn().mockResolvedValue(body),
  });

  it('returns 400 if uuid param is missing', async () => {
    const req = mockRequest({ newStatus: 'seated' });

    const res = await PATCH(req, { params: { uuid: '' } });

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'UUID is required' },
      { status: 400 }
    );
  });

  it('forwards PATCH request and returns backend response', async () => {
    const reqBody = { newStatus: 'seated' };
    const req = mockRequest(reqBody);
    const params = { uuid: 'abc123' };

    // Mock global fetch
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
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await PATCH(req, { params });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error proxying PATCH /parties:',
      expect.any(Error)
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to update party' },
      { status: 500 }
    );

    consoleErrorSpy.mockRestore();
  });
});
