import renderSeats from '@/helpers/renderSeats';

describe.only('renderSeats', () => {
  it('renders all empty seats when no one is seated', () => {
    expect(renderSeats(5, 5, 0)).toBe('⬛⬛⬛⬛⬛');
  });

  it('renders only current party when no one else is seated', () => {
    expect(renderSeats(5, 4, 1)).toBe('🟢⬛⬛⬛⬛');
    expect(renderSeats(5, 3, 2)).toBe('🟢🟢⬛⬛⬛');
  });

  it('renders other parties correctly', () => {
    expect(renderSeats(6, 2, 1)).toBe('🟢🟩🟩🟩⬛⬛');
    // total: 6, available: 2 => filled = 4
    // partySize = 1, other = 3
  });

  it('renders full room with mix of party and others', () => {
    expect(renderSeats(4, 0, 2)).toBe('🟢🟢🟩🟩');
  });

  it('renders empty string if total seats is 0', () => {
    expect(renderSeats(0, 0, 0)).toBe('');
  });

  it('caps current party rendering when filled is less than party size', () => {
    expect(renderSeats(5, 2, 5)).toBe('🟢🟢🟢⬛⬛');
    // total: 5, available: 2 => filled = 3
    // partySize = 5, min(5, 3) = 3
  });

  it('renders correctly when all seats are filled but party is 0', () => {
    expect(renderSeats(4, 0, 0)).toBe('🟩🟩🟩🟩');
  });
});
