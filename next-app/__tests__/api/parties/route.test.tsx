import { GET } from '@/app/api/parties/route';

global.fetch = jest.fn();

describe('GET /api/parties', () => {
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  it('returns parties data successfully', async () => {
    const mockData = [
      { uuid: 'uuid-1', name: 'Alice', size: 2, status: 'waiting' },
    ];
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
      status: 200,
    });

    const response = await GET();
    const json = await response.json();

    expect(fetch).toHaveBeenCalledWith('http://backend:4000/parties');
    expect(json).toEqual(mockData);
    expect(response.status).toBe(200);
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: 'Failed to fetch parties' });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
});
