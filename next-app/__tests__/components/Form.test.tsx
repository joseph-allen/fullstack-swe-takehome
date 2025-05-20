import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableForm from '@/components/TableForm';

describe('TableForm', () => {
  // Test default props for our loading component
  it('renders loading form', () => {
    render(<TableForm />);
    expect(screen.getByText('Join the queue')).toBeInTheDocument();
  });
});
