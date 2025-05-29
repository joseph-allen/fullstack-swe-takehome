import { GET } from '@/app/api/parties/route';
import { NextRequest } from 'next/server';

global.fetch = jest.fn();

describe('GET /api/parties', () => {
  // spy on console, supressing errors
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  // mock NextRequest to simulate incoming requests
  const createMockReq = (status: string | null) =>
    ({
      nextUrl: {
        searchParams: {
          get: jest.fn().mockReturnValue(status),
        },
      },
    }) as unknown as NextRequest;

  it('returns parties data successfully without filter', async () => {
    const mockData = [
      { uuid: 'uuid-1', name: 'Alice', size: 2, status: 'waiting' },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
      status: 200,
    });

    const mockReq = createMockReq(null);
    const response = await GET(mockReq);
    const json = await response.json();

    expect(fetch).toHaveBeenCalledWith('http://backend:4000/parties');
    expect(json).toEqual(mockData);
    expect(response.status).toBe(200);
  });

  it('returns parties data filtered by status', async () => {
    const mockResData = [
      { uuid: 'uuid-2', name: 'Bob', size: 3, status: 'waiting' },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResData,
      status: 200,
    });

    const mockReq = createMockReq('waiting');
    const response = await GET(mockReq);
    const json = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      'http://backend:4000/parties?status=waiting'
    );
    expect(json).toEqual(mockResData);
    expect(response.status).toBe(200);
  });

  it('returns 400 for invalid status query', async () => {
    const mockReq = createMockReq('invalid_status');

    const response = await GET(mockReq);
    const json = await response.json();

    expect(fetch).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(json).toEqual({
      error: 'Invalid status: must be one of waiting, seated, done',
    });
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const mockReq = createMockReq(null);
    const response = await GET(mockReq);
    const json = await response.json();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'GET /api/parties error:',
      expect.any(Error)
    );
  });
});
