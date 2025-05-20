import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableForm from '@/components/TableForm';

describe('TableForm', () => {
  it('renders the form with default elements', () => {
    render(<TableForm />);
    expect(screen.getByText('Join the queue')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('Party size:')).toBeInTheDocument();
  });

  it('allows user to type a name', () => {
    render(<TableForm />);
    const nameInput = screen.getByLabelText('Name');

    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    expect(nameInput).toHaveValue('Alice');
  });

  it('shows default party size', () => {
    render(<TableForm />);
    const partySizeInput = screen
      .getByTestId('party-input')
      .querySelector('input');
    expect(partySizeInput).toHaveValue(1);
  });

  it('increments and decrements party size', () => {
    render(<TableForm />);
    const incrementButton = screen.getByLabelText('Increase');
    const decrementButton = screen.getByRole('button', {
      name: 'Decrease',
    });
    const partySizeInput = screen
      .getByTestId('party-input')
      .querySelector('input');

    // Initial party size
    expect(partySizeInput).toHaveValue(1);

    fireEvent.click(incrementButton);
    expect(partySizeInput).toHaveValue(2);

    fireEvent.click(decrementButton);
    expect(partySizeInput).toHaveValue(1);
  });

  it('does not allow party size below 1 or above max', () => {
    render(<TableForm />);
    const incrementButton = screen.getByLabelText('Increase');
    const decrementButton = screen.getByRole('button', {
      name: 'Decrease',
    });
    const partySizeInput = screen
      .getByTestId('party-input')
      .querySelector('input');

    // Decrement below 1 clamps at 1
    fireEvent.click(decrementButton);
    fireEvent.click(decrementButton);
    fireEvent.click(decrementButton);
    expect(partySizeInput).toHaveValue(1);

    // Increment above MAX_TABLE_SIZE clamps at MAX_TABLE_SIZE
    for (let i = 0; i < 10; i++) {
      fireEvent.click(incrementButton);
    }
    expect(partySizeInput).toHaveValue(8); // Assuming MAX_TABLE_SIZE = 8
  });
});
