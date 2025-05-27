import renderSeats from '@/helpers/renderSeats';

describe('renderSeats', () => {
  it('renders all empty seats when no one is seated', () => {
    expect(renderSeats(5, 5, 0)).toBe('⬛⬛⬛⬛⬛');
  });

  it('renders only current party when no one else is seated', () => {
    expect(renderSeats(5, 4, 1)).toBe('🟢⬛⬛⬛⬛');
    expect(renderSeats(5, 3, 2)).toBe('🟢🟢⬛⬛⬛');
  });

  // TODO: This logic is not right, a party like this would never be sat
  // it('limits current party rendering to available seats', () => {
  //   expect(renderSeats(5, 1, 5)).toBe('🟢🟩🟩🟩⬛');
  //   // total: 5, available: 1 => filled = 4
  //   // partySize = 5, but only 4 filled, so party = 4, other = 0
  //   expect(renderSeats(5, 0, 5)).toBe('🟢🟢🟢🟢🟢');
  // });

  // TODO: assumes 2 in party
  // it('renders other parties correctly', () => {
  //   expect(renderSeats(6, 2, 1)).toBe('🟢🟩🟩⬛⬛⬛');
  //   // total: 6, available: 2 => filled = 4
  //   // partySize = 1, other = 3
  // });

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
